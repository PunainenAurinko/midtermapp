/*
Course: MAD9022 Cross-Platform App Development
Student: Vladimir Tonkonogov
Project: Midterm App built using HTML, CSS & JavaScript and compiled for Android using Cordova
 */

// App Constructor
//
var tonk0006_midterm = {
    latitude: '',
    longitude: '',
    id: '',
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
            alert("Sorry, something prevented your phone from determening your location.")
        }
    },
    
    // Display listview list on page. Set contacts array to localStorage. Initialize Hammer.js listeners.
    //
    foundContacts: function (contacts) {
        console.log('\n\tARRAY OF ALL PHONE CONTACTS:');
        console.log(contacts);

        var output = document.querySelector('#contacts');
        var ul = document.createElement('ul');
        ul.setAttribute('data-role', 'listview');
        output.appendChild(ul);

        var contactsArray = [];
        for (var i = 0; i < 12; i++) {

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

        console.log('\n\t12 CONTACTS ARRAY:');
        console.log(contactsArray);

        console.log('\n\tJSON STRING CONTACTS ARRAY IN LOCAL STORAGE:');
        var s = JSON.stringify(contactsArray);
        console.log(s);

        localStorage.setItem('myContactsArray', s);
                        
        tonk0006_midterm.enableNavigation();

    },
    
        // Hammer.js event listeners and app navigation logic
        //
    
        enableNavigation: function (nav) {
    
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
        hm.on('doubletap', tonk0006_midterm.checkContactCooordinates);
            
//        hm.on('doubletap', tonk0006_midterm.displayDialog);
        
        var closeModal = new Hammer(document.getElementById('closeButton'));
        closeModal.on('tap', tonk0006_midterm.goBackAndClose);
        
        var goToMap = new Hammer(document.getElementById('goToMap'));
        goToMap.on('tap', tonk0006_midterm.displayMapPage);

        var backFromMapPage = new Hammer(document.getElementById('backButton'));
        backFromMapPage.on('tap', tonk0006_midterm.goBackAndClose);
            
        // Working standard single click/tap event listeners just for the sake of it
        //

        //        document.querySelector('[data-role=listview]').addEventListener('click', tonk0006_midterm.displayFullContact);
        //        document.getElementById('closeButton').addEventListener('click', tonk0006_midterm.goBackAndClose);
        //        document.getElementById('backButton').addEventListener('click', tonk0006_midterm.goBackAndClose);
        
    },
    
    displayFullContact: function (ev) {
        document.querySelector('[data-role=modal]#modal').style.display = 'block';
        document.querySelector('[data-role=overlay]').style.display = 'block';

        id = ev.target.getAttribute('data-ref');
        document.getElementById('modal').value = id;

        var output2 = document.querySelector('#modal');
        var p = document.createElement('p');
        var stringArray = localStorage.getItem('myContactsArray');
        console.log('\n\tON SINGLE CLICK:');
        //        console.log(stringArr);
        var realArray = JSON.parse(stringArray);
        var n = id; // This is needed only for my phone with "var n = (id - 20)" - to be able to pick contacts starting from #20
        console.log('Contact\'s ID: ' + n);
        console.log('Contact\'s Name: ' + realArray[n].name);
        p.innerHTML = realArray[n].name + '<br/>';
        var nummmm = realArray[n].numbers;
        //console.log('Contacts Array:')
        //console.log(realArray);
        console.log('Phones Array:')
        console.log(nummmm);
        var nummmmString = nummmm.join(' ');
        console.log('Phones String: ' + nummmmString);
        p.innerHTML += nummmmString;
        console.log(p);
        output2.appendChild(p);
    },
    
    checkContactCooordinates: function (ev) {
    
            //  Check if contact has no coordinates stored in local storage
        
        id = ev.target.getAttribute('data-ref');
        document.querySelector('[data-role="listview"]').value = id;
        
        var stringArray = localStorage.getItem('myContactsArray');
        var realArray = JSON.parse(stringArray);
        var n = id; // This is needed only for my phone with "var n = (id - 20)" - to be able to pick contacts starting from #20
        console.log('\n\tON DOUBLE CLICK:');
        console.log('Contact\'s ID: ' + n);
        console.log('Contact\'s Name: ' + realArray[n].name);
        
        if (realArray[n].lat.length !== 0 || realArray[n].lat.length !== 0) {
            tonk0006_midterm.displayMapPage();
        } else {
            tonk0006_midterm.displayDialog();
        }
    },

    displayDialog: function (ev) {

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
        
        //tonk0006_midterm.findStreetAddress();
        
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

    // Diplay dynamic Google map of current position with a marker in the centre using  Google JavaScript API v3
    // 
    drawMap: function () {

        //  Check if contact has coordinates stored in local storage
        
        var stringArray = localStorage.getItem('myContactsArray');
        var realArray = JSON.parse(stringArray);
        var n = id; // This is needed only for my phone with "var n = (id - 20)" - to be able to pick contacts starting from #20
        
        var lat = (realArray[n].lat || latitude);
        var lng = (realArray[n].lng || longitude);
        
        // Call Reverse Geocoding function to display street address
        
        tonk0006_midterm.findStreetAddress(lat, lng);
        
        // Create the div to display the map in
        
        var div = document.createElement('div');
        div.setAttribute('id', 'map-canvas');
        div.style.width = '95%';
        div.style.height = '400px';
        var output6 = document.querySelector('#map');
        output6.appendChild(div);
        
        // Create map
        
        var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(lat, lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        var map = new google.maps.Map(div,
            mapOptions);
        
        var marker = new google.maps.Marker({
            position: map.getCenter(),
            animation: google.maps.Animation.DROP,
            map: map
        });
        
        setTimeout(function(){ marker.setAnimation(google.maps.Animation.BOUNCE); }, 1500);
        
        map.setOptions({disableDoubleClickZoom: true });
        
        // Google map doule click listener function
        
        google.maps.event.addListener(map, 'dblclick', function (event) {
            
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();
            
            var h4 = document.querySelector('h4');
            if (h4 !== null) // or simply if(h4) 
                output6.removeChild(h4);
            
            tonk0006_midterm.findStreetAddress(lat, lng);            
            
            console.log('\n\tSET LAT & LNG TO LOCAL STORAGE:');
                        
            var stringArray = localStorage.getItem('myContactsArray');
            var realArray = JSON.parse(stringArray);
            
            var n = id; // This is needed only for my phone with "var n = (id - 20)" - to be able to pick contacts starting from #20
            console.log('Contact\'s ID: ' + n);
            var obj = realArray[n];
            //console.log(obj);
//            console.log(obj.lat); // Outputs an empty string as the lat is empty for now
//            console.log(obj.lng); // Outputs an empty string as the lng is empty for now
            obj.lat = lat;
            obj.lng = lng;
            console.log('Contact\'s Name: ' + obj.name);
            console.log('Contact\'s Lat: ' +obj.lat);
            console.log('Contact\'s Lng: ' +obj.lng);
            console.log(obj);
            console.log(realArray);
            var s = JSON.stringify(realArray);
            console.log('\n\tSTRING CONTACTS ARRAY IN LOCAL STORAGE WITH LAT & LNG SET FOR THIS CONTACT: ');
            console.log(s);
            localStorage.setItem('myContactsArray', s);
            
            var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(lat, lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.querySelector('#map-canvas'),
                mapOptions);

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP
            });
            
            //Recenter the map               
            var reCenter = new google.maps.LatLng(lat, lng);
            map.setCenter(reCenter);
            
            setTimeout(function(){ marker.setAnimation(google.maps.Animation.BOUNCE); }, 1500);

        });

    },
    
        // Get and display human-readable street address based on the passed coordinates using Google Maps JavaScript API v3 Reverse Geocoding process

    // Full street address is transmitted interchengeably either in results[0].formatted_address or in results[1].formatted_address, therefore the inner if statement is used to pick between them

    findStreetAddress: function (lat,lng) {
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);
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
                var parent = document.querySelector('#map');
                var firstChild = document.querySelector('.formBox');
                parent.insertBefore(h4, firstChild.nextSibling);
                h4.setAttribute('id', 'text');

            } else {
                alert("Geocoder failed due to: " + status);
            }
        });
    },
    
    // BUTTON CLOSE AND GO BACK FUNCTIONS --->>>>

    goBackAndClose: function (ev) {
        
        tonk0006_midterm.onContentLoaded();

        var p = document.querySelector('p');
        if (p !== null) // or simply if(p) 
            p.parentNode.removeChild(p);
        
        var div = document.querySelector("#map-canvas");
        if (div !== null) // or simply if(div)
            div.parentNode.removeChild(div);
        
        var h4 = document.querySelector('#text');
            if (h4 !== null) // or simply if(h4) 
                h4.parentNode.removeChild(h4);

    },

    // Handle the back button
    //
    hardwareBackButton: function (ev) {
        //        alert("GOING BACK");
        ev.preventDefault();
        tonk0006_midterm.goBackAndClose();
    },
    
//    exitFromApp: function () {
//
//        if (navigator.app) {
//           navigator.app.exitApp();
//        }
//        else if (navigator.device) {
//            navigator.device.exitApp();
//        }
//    },

    // Failed to get the contacts
    //
    foundNothing: function (contactError) {
        alert("Unable to display contacts!");
    }
};

tonk0006_midterm.init();