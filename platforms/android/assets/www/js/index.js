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
        window.addEventListener('popstate', this.browserBackButton, false);
        this.loadPage(null);
    },

    // DOMContentLoaded event handler function
    //
    onContentLoaded: function () {
        //FastClick.attach(document.body);
        pages = document.querySelectorAll('[data-role="page"]');
        numPages = pages.length;
        links = document.querySelectorAll('[data-role="pagelink"]');
        numLinks = links.length;
        for (var i = 0; i < numLinks; i++) {
            //either add a touch or click listener

            links[i].addEventListener('click', this.handleNav, false);
        }
    },

    // Handle the click event

    handleNav: function (ev) {
        ev.preventDefault();
        var href = ev.currentTarget.href;
        var parts = href.split('#');
        console.log('Clicked: page ' + parts[1]);
        this.loadPage(parts[1]);
        return false;
    },

    // Deal with history API and switching divs, and enable transitions

    loadPage: function (url) {
        if (url == null) {
            //home page first call
            pages[0].style.display = 'block';
            history.replaceState(null, null, '#home');
        } else {

            for (var i = 0; i < numPages; i++) {
                if (pages[i].id == url) {
                    pages[i].style.display = 'block';
                    pages[i].className = 'active';
                    history.pushState(null, null, '#' + url);
                } else {
                    pages[i].className = '';
                    pages[i].style.display = 'block';
                }
            }
            for (var t = 0; t < numLinks; t++) {
                links[t].className = '';
                if (links[t].href == location.href) {
                    links[t].className = 'activetab';
                }
            }
        }
    },

    // Function to handle the back button
    //
    browserBackButton: function (ev) {
        url = location.hash; //hash will include the "#"
        //update the visible div and the active tab
        for (var i = 0; i < numPages; i++) {
            if (('#' + pages[i].id) == url) {
                pages[i].style.display = 'block';
                pages[i].className = 'active';
            } else {
                pages[i].className = '';
                pages[i].style.display = 'block';
            }
        }
        for (var t = 0; t < numLinks; t++) {
            links[t].className = '';
            if (links[t].href == location.href) {
                links[t].className = 'activetab';
            }
        }
    },

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
        navigator.contacts.find(filter, this.onSuccess, this.onError, options);
    },

    // Make an array of objects
    //
    onSuccess: function (contacts) {
        console.log('\n\tCONTACTS:');
        console.log(contacts);

        var output = document.querySelector('#contacts');
        var ul = document.createElement('ul');
        output.appendChild(ul);

        var contactsArr = [];
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
            contactsArr.push(contact);
            
            var li = document.createElement('li');
            li.innerHTML = contacts[i].displayName + '<br>';
            ul.appendChild(li);
        }
        
        console.log(contactsArr);
        
        console.log('\n\tJSON Object for Contacts');
        var s = JSON.stringify(contactsArr);
        console.log('\n');
        console.log(s);
        
        this.toLocalStorage;
    },

    toLocalStorage: function () {
        localStorage.setItem('contactsArr', JSON.parse(contact));
    }
};

tonk0006_midterm.init();