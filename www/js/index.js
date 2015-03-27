/*
Course: MAD9022 Cross-Platform App Development
Student: Vladimir Tonkonogov
Project: Midterm App built using HTML, CSS & JavaScript and compiled for Android using Cordova
 */

// Application Constructor
//
var tonk0006_midterm = {
    latitude: '',
    longitude: '',
    //mapOptions: null,
    init: function () {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('backbutton', this.hardwareBackButton, false);
        document.addEventListener('DOMContentLoaded', this.onContentLoaded, false);
    },

    // DOMContentLoaded event handler function
    //
    onContentLoaded: function () {
        document.querySelector('[data-role=modal]').style.display = 'none';
        document.querySelector('[data-role=overlay]').style.display = 'none';
        document.querySelector('[data-role=page]#map').style.display = 'none';
        document.querySelector('[data-role=modal]#dialog').style.display = 'none';
        document.querySelector('[data-role=page]#contacts').style.display = 'block';
    },

    // deviceready Event Handler
    //
    onDeviceReady: function () {
        tonk0006_midterm.receivedEvent('deviceready');
    },

    // Initiate Cordova specific APIs
    //
    receivedEvent: function () {

        // Contacts API call

        var options = new ContactFindOptions();
        options.filter = '';
        options.multiple = true;
        var filter = ['displayName', 'phoneNumbers'];
        navigator.contacts.find(filter, this.foundContacts, this.foundNothing, options);

        // Geolocation API call

        if (navigator.geolocation) {

            var params = {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 90000
            };

            navigator.geolocation.getCurrentPosition(this.findCoordinates, this.gpsError, params);

        } else {
            //no support for geolocation
            alert("Sorry, somethign prevented your phone from determening your location.")
        }
    },

    // Display listview list on page. Set contacts array to localStorage. Initialize Hammer.js listeners.
    //
    foundContacts: function (contacts) {
        console.log('\n\tALL PHONE CONTACTS:');
        console.log(contacts);

        var output = document.querySelector('#contacts');
        var ul = document.createElement('ul');
        ul.setAttribute('data-role', 'listview');
        output.appendChild(ul);

        var contactsArray = [];
        for (var i = 20; i < 32; i++) {

            var contact = {};
            contact.id = i;
            contact.name = contacts[i].displayName;

            if (contacts[i].phoneNumbers.length) {
                contact.numbers = [];
                for (var l = 0; l < contacts[i].phoneNumbers.length; l++) {
                    contact.numbers.push(contacts[i].phoneNumbers[l].type + ': ' + contacts[i].phoneNumbers[l].value + '\r');
                }
            }
            contact.lat = '';
            contact.lng = '';
            contactsArray.push(contact);

            var li = document.createElement('li');
            li.innerHTML = contacts[i].displayName + '<br>';
            li.setAttribute('data-ref', i);
            ul.appendChild(li);
        }

        console.log('\n\tOUR 12 CONTACTS:');
        console.log(contactsArray);

        console.log('\n\tJSON OBJECT FOR CONTACTS:');
        var s = JSON.stringify(contactsArray);
        console.log(s);

        localStorage.setItem('myContactsArray', s);

        // Hammer.js event listeners

        var hammer = document.querySelector('[data-role="listview"]');
        var hm = new Hammer.Manager(hammer);
        var singleTap = new Hammer.Tap({
            event: 'singletap'
        });
        var doubleTap = new Hammer.Tap({
            event: 'doubletap',
            taps: 2,
            threshold: 10,
            posThreshold: 40
        });

        hm.add([doubleTap, singleTap]);
        doubleTap.requireFailure(singleTap);

        hm.on('singletap', tonk0006_midterm.displayFullContact);
        hm.on('doubletap', tonk0006_midterm.displayDialog);

        var closeModal = new Hammer(document.getElementById('closeButton'));
        closeModal.on('tap', tonk0006_midterm.goBackAndClose);
        
        var goToMap = new Hammer(document.getElementById('goToMap'));
        goToMap.on('tap', tonk0006_midterm.displayMapPage);

        var backFromMapPage = new Hammer(document.getElementById('backButton'));
        backFromMapPage.on('tap', tonk0006_midterm.goBackAndClose);

        //        document.querySelector('[data-role=listview]').addEventListener('click', tonk0006_midterm.displayFullContact);
        //        document.getElementById('closeButton').addEventListener('click', tonk0006_midterm.goBackAndClose);
        //        document.getElementById('backButton').addEventListener('click', tonk0006_midterm.goBackAndClose);

    },

    displayFullContact: function (ev) {
        document.querySelector('[data-role=modal]#modal').style.display = 'block';
        document.querySelector('[data-role=overlay]').style.display = 'block';

        var id = ev.target.getAttribute('data-ref');
        var idVal = ev.target.innerHTML;
        document.getElementById('modal').value = id;

        var output2 = document.querySelector('#modal');
        var p = document.createElement('p');
        var stringArr = localStorage.getItem('myContactsArray');
        console.log('\n\tFROM LOCAL STORAGE:');
        //        console.log(stringArr);
        var realArr = JSON.parse(stringArr);
        console.log(realArr);
        var n = (id - 20); // This is needed only for my phone with "var n = (id - 20)" - to pick contacts starting from #20
        console.log("Contact ID: " + n);
        p.innerHTML = realArr[n].name + '<br/>';
        var nummmm = realArr[n].numbers;
        console.log(nummmm);
        var nummmmString = nummmm.join(" ");
        console.log(nummmmString);
        p.innerHTML += nummmmString;
        console.log(p);
        output2.appendChild(p);
    },

    displayDialog: function (ev) {

        //        if (contact has no coordinates stored in local storage)
        document.querySelector('[data-role=overlay]').style.display = 'block';
        document.querySelector('[data-role=modal]#dialog').style.display = 'block';


        var output8 = document.querySelector('#dialog');
        var p = document.createElement('p');
        p.innerHTML = 'Please enter contact coordinates by double-clicking anywhere on the map';
        output8.appendChild(p);
    },

    displayMapPage: function () {

        document.querySelector('[data-role=page]#contacts').style.display = 'none';
        document.querySelector('[data-role=page]#map').style.display = 'block';
        document.querySelector('[data-role=modal]#dialog').style.display = 'none';
        document.querySelector('[data-role=overlay]').style.display = 'none';

        var output10 = document.querySelector('#dialog');
        var p = document.querySelector('p');
        if (p !== null)
            output10.removeChild(p);

        tonk0006_midterm.drawMap();

    },

    // Get location coordinates
    //
    findCoordinates: function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        console.log("\n\tCOORDINATES:");
        console.log("Latitude: " + latitude);
        console.log("Longitude: " + longitude);

        tonk0006_midterm.findStreetAddress();
    },

    // Handle error messages for findCoordinates function
    //
    gpsError: function (error) {
        var errors = {
            1: 'Permission denied',
            2: 'Position unavailable',
            3: 'Request timeout'
        };
        alert("Error: " + errors[error.code]);
    },

    // Get and display human-readable street address based on the found coordinates using Google Maps JavaScript API v3 Reverse Geocoding process

    // Full street address is transmitted interchengeably either in results[0].formatted_address or in results[1].formatted_address, therefore the inner if statement is used to pick between them

    findStreetAddress: function () {
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(latitude, longitude);
        geocoder.geocode({
            'latLng': latlng
        }, function (results, status) {
            console.log("\n\tGEOCODING:");
            console.log("Geocoding status: " + status);
            console.log(results);
            if (status == google.maps.GeocoderStatus.OK) {
                console.log("Address 0: " + results[0].formatted_address);
                console.log("Address 1: " + results[1].formatted_address + "\n");
                var h4 = document.createElement("h4");
                if (results[1].formatted_address.length > results[0].formatted_address.length) {
                    h4.innerHTML = results[1].formatted_address;
                } else {
                    h4.innerHTML = results[0].formatted_address;
                }
                var output5 = document.querySelector("#map");
                output5.appendChild(h4);
                h4.setAttribute("id", "text");

            } else {
                alert("Geocoder failed due to: " + status);
            }
        });
    },

    // Diplay dynamic Google map of current position with a marker in the centre using  Google JavaScript API v3
    // 

    drawMap: function () {

        var div = document.createElement('div');
        div.setAttribute('id', 'map-canvas');
        div.style.width = "95%";
        div.style.height = "400px";
        var output6 = document.querySelector("#map");
        output6.appendChild(div);

        //        google.maps.event.addDomListener(window, 'load', this.mapInit);

        var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(latitude, longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(div,
            mapOptions);

        var marker = new google.maps.Marker({
            position: map.getCenter(),
            map: map,
        });

        // Redraw the map
        google.maps.event.trigger(map, 'resize');

        // Recenter the map now that it's been redrawn               
        var reCenter = new google.maps.LatLng(latitude, longitude);
        map.setCenter(reCenter);

        //        map.fitBounds(markers.reduce(function (bounds, marker) {
        //            return bounds.extend(marker.getPosition());
        //        }, new google.maps.LatLngBounds()));

        //        drawMap();

    },

    //Working code for displaying Google map in an iframe tag, using Google Maps Embed API
    //

    //    drawMap: function () {
    //        var text = document.querySelector("#text").innerHTML;
    //        console.log(text);
    //        var splittext = text.split(" ", 7);
    //        console.log(splittext);
    //        var part0 = splittext[0];
    //        var part1 = splittext[1];
    //        var part2 = splittext[2];
    //        var part3 = splittext[3];
    //        var part4 = splittext[4];
    //        var part5 = splittext[5];
    //        var part6 = splittext[6];
    //        var part6lesscomma = part6.split(",", 1);
    //        part6 = part6lesscomma[0];
    //        console.log(part0);
    //        console.log(part1);
    //        console.log(part2);
    //        console.log(part3);
    //        console.log(part4);
    //        console.log(part5);
    //        console.log(part6);
    //        var iframe = document.createElement("iframe");
    //        var output7 = document.querySelector("#map");
    //        output7.appendChild(iframe);
    //        iframe.setAttribute("width", "100%");
    //        iframe.setAttribute("height", "400");
    //        iframe.setAttribute("frameborder", "0");
    //        iframe.setAttribute("scrolling", "0");
    //        iframe.setAttribute("marginheight", "0");
    //        iframe.setAttribute("marginwidth", "0");
    //        iframe.setAttribute("src", "https://www.google.com/maps/embed/v1/place?q=" + part0 + "+" + part1 + "+" + part2 + "+" + part3 + "+" + part4 + "+" + part5 + "+" + part6 + "/@" + latitude + "," + longitude + ",17z&zoom=13&key=AIzaSyDP68CXSK9TynSN4n_Moo7PPakL8SQM0xk");
    //        //        iframe.setAttribute("src", "https://www.google.com/maps/embed/v1/view?key=AIzaSyDP68CXSK9TynSN4n_Moo7PPakL8SQM0xk&center=" +  latitude + "," + longitude + "&zoom=13&maptype=roadmap");
    //        return iframe;
    //     },


    // BUTTON CLOSE AND GO BACK FUNCTIONS --->>>>

    goBackAndClose: function (ev) {
        
        tonk0006_midterm.onContentLoaded();

        var p = document.querySelector('p');
        if (p !== null) 
            p.parentNode.removeChild(p);
        
        var div = document.querySelector("#map-canvas");
        if (div !== null)
            div.parentNode.removeChild(div);
        
    },

    // Handle the back button
    //
    hardwareBackButton: function (ev) {
        //        alert("GOING BACK");
        ev.preventDefault();
        tonk0006_midterm.goBackAndClose();
        
//        if (ev.currentTarget > 5)
//            navigator.app.exitApp();
    },

    // Failed to get the contacts
    //
    foundNothing: function (contactError) {
        alert("Unable to display contacts!");
    }
};

tonk0006_midterm.init();