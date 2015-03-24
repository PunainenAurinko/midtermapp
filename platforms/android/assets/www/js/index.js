/*
Course: MAD9022 Cross-Platform App Development
Student: Vladimir Tonkonogov
Project: Midterm App built using HTML, CSS & JavaScript and compiled for Android using Cordova
 */

var tonk0006_midterm = {
    // Application Constructor
    pages: [],
    links: [],
    numLinks: 0,
    numPages: 0,
    lat: '',
    lng: '',
    init: function () {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    bindEvents: function () {
        document.addEventListener('DOMContentLoaded', this.onContentLoaded, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //        window.addEventListener('popstate', this.browserBackButton, false);
        //        this.loadPage(null);

        //        var hammer = new Hammer.Manager(li, {});
        //
        //        var singleTap = new Hammer.Tap({
        //            event: 'singletap'
        //        });
        //        var doubleTap = new Hammer.Tap({
        //            event: 'doubletap',
        //            taps: 2
        //        });
        //
        //        hammer.add([doubleTap, singleTap]);
        //        doubleTap.recognizeWith(singleTap);
        //        singleTap.requireFailure(doubleTap);
        //
        //        if (tapCount === 0) {
        //            // no failing requirements, immediately trigger the tap event
        //            // or wait as long as the multitap interval to trigger
        //            if (!this.hasRequireFailures()) {
        //                return STATE_RECOGNIZED;
        //            } else {
        //                this._timer = setTimeoutContext(function () {
        //                    this.state = STATE_RECOGNIZED;
        //                    this.tryEmit();
        //                }, options.interval, this);
        //                return STATE_BEGAN;
        //            }
        //        }


    },

    // DOMContentLoaded event handler function
    //
    onContentLoaded: function () {
        document.querySelector("[data-role=modal]").style.display = "none";
        document.querySelector("[data-role=overlay]").style.display = "none";
    },

    //    // Handle the click event
    //
    //    handleNav: function (ev) {
    //        ev.preventDefault();
    //        var href = ev.currentTarget.href;
    //        var parts = href.split('#');
    //        console.log('Clicked: page ' + parts[1]);
    //        this.loadPage(parts[1]);
    //        return false;
    //    },

    //    // Deal with history API and switching divs, and enable transitions
    //
    //    loadPage: function (url) {
    //        if (url == null) {
    //            //home page first call
    //            pages[0].style.display = 'block';
    //            history.replaceState(null, null, '#home');
    //        } else {
    //
    //            for (var i = 0; i < numPages; i++) {
    //                if (pages[i].id == url) {
    //                    pages[i].style.display = 'block';
    //                    pages[i].className = 'active';
    //                    history.pushState(null, null, '#' + url);
    //                } else {
    //                    pages[i].className = '';
    //                    pages[i].style.display = 'block';
    //                }
    //            }
    //            for (var t = 0; t < numLinks; t++) {
    //                links[t].className = '';
    //                if (links[t].href == location.href) {
    //                    links[t].className = 'activetab';
    //                }
    //            }
    //        }
    //    },
    //
    //    // Function to handle the back button
    //    //
    //    browserBackButton: function (ev) {
    //        url = location.hash; //hash will include the "#"
    //        //update the visible div and the active tab
    //        for (var i = 0; i < numPages; i++) {
    //            if (('#' + pages[i].id) == url) {
    //                pages[i].style.display = 'block';
    //                pages[i].className = 'active';
    //            } else {
    //                pages[i].className = '';
    //                pages[i].style.display = 'block';
    //            }
    //        }
    //        for (var t = 0; t < numLinks; t++) {
    //            links[t].className = '';
    //            if (links[t].href == location.href) {
    //                links[t].className = 'activetab';
    //            }
    //        }
    //    },

    // deviceready Event Handler
    //
    onDeviceReady: function () {
        tonk0006_midterm.receivedEvent('deviceready');
    },

    // Find contacts
    //
    receivedEvent: function () {

        var options = new ContactFindOptions();
        options.filter = '';
        options.multiple = true;
        var filter = ['displayName', 'phoneNumbers'];
        navigator.contacts.find(filter, this.foundContacts, this.foundNothing, options);
    },

    // Make an array of objects
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

            for (var l = 0; l < contacts[i].phoneNumbers.length; l++) {
                if (contacts[i].phoneNumbers.length > 1) {
                    contact.numbers = [contacts[i].phoneNumbers[l].type, contacts[i].phoneNumbers[l].value];
                } else {
                    contact.numbers = [contacts[i].phoneNumbers[0].type, contacts[i].phoneNumbers[0].value];
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

        var hammer = document.querySelector('[data-role="listview"]');
        var hm = new Hammer.Manager(hammer);
        var singleTap = new Hammer.Tap({
            event: 'singletap'
        });
        var doubleTap = new Hammer.Tap({
            event: 'doubletap',
            taps: 2
        });

        hm.add([doubleTap, singleTap]);
        doubleTap.recognizeWith('singletap');
        singleTap.requireFailure('doubletap');

        hm.on('singletap', tonk0006_midterm.displayFullContact);
        //                hm.on('doubletap', tonk0006_midterm.displayMap);

        var modalClose = new Hammer(document.getElementById("closeButton"));
        modalClose.on('tap', tonk0006_midterm.closeModalWindow);

//        document.querySelector('[data-role=listview]').addEventListener('click', tonk0006_midterm.displayFullContact);
//        document.getElementById('closeButton').addEventListener('click', tonk0006_midterm.closeModalWindow);

        localStorage.setItem('myContactsArray', JSON.stringify(contactsArray));

        this.clickEventsFunc;
        this.toLocalStorage;
    },

    clickEventsFunc: function () {

        //        var hammer = document.querySelector('[data-role="listview"]');
        //        var hm = new Hammer.Manager(hammer);
        //        var singleTap = new Hammer.Tap({
        //            event: 'singletap',
        //            domEvents: true
        //        });
        //        var doubleTap = new Hammer.Tap({
        //            event: 'doubletap',
        //            taps: 2
        //        });
        //
        //        hm.add([doubleTap, singleTap]);
        //        doubleTap.recognizeWith('singletap');
        //        singleTap.requireFailure('doubletap');
        //
        //        hm.on('singletap', tonk0006_midterm.displayFullContact);
        //        //                hm.on('doubletap', tonk0006_midterm.displayMap);
        //
        //        var modalClose = new Hammer(document.getElementById("closeButton"));
        //        modalClose.on('tap', tonk0006_midterm.closeModalWindow);

        console.log('Arrived here 2!');

        //        document.querySelector('[data-role=listview]').addEventListener('click', this.displayFullContact);
        //        document.getElementById('closeButton').addEventListener('click', this.closeModalWindow);

    },

    toLocalStorage: function () {
        localStorage.setItem('myContactsArray', JSON.stringify(contactsArray));
    },

    displayFullContact: function () {
        //ev.stopPropagation();

        document.querySelector("[data-role=modal]").style.display = "block";
        document.querySelector("[data-role=overlay]").style.display = "block";
        
        

        this.fromLocalStorage;

    },

    fromLocalStorage: function () {
        localStorage.getItem('contactsArray', JSON.parse(contactsArray));

        console.log(s);
        console.log(contactsArray);
    },

    closeModalWindow: function (ev) {
        document.querySelector("[data-role=modal]").style.display = "none";
        document.querySelector("[data-role=overlay]").style.display = "none";
    },

    // Failed to get the contacts

    foundNothing: function (contactError) {
        alert("Unable to display contacts!");
    }
};

tonk0006_midterm.init();