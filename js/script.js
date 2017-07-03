//Global variables
var map;
var markers = [];
var infoWindow;

//locations
var placesList = [
    {
        name: '天安门',
        location: {lat: 39.9087158, lng: 116.3974857}
    },
    {
        name: '天坛',
        location: {lat: 39.8836928, lng: 116.4073963}
    },
    {
        name: '首都博物馆',
        location: {lat: 39.9064443, lng: 116.3419533}
    },
    {
        name: '地坛',
        location: {lat: 39.9528459, lng: 116.416111}
    },
    {
        name: '圆明园',
        location: {lat: 40.0080918, lng: 116.2982225}
    },
    {
        name: '首都图书馆',
        location: {lat: 39.8690369, lng: 116.4636183}
    }
];


//Initialize map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.9087158, lng: 116.3974857},
        zoom: 12,
        mapTypeControl: false,

    });

    //knockout viewmodel binding
    ko.applyBindings(new ViewModel());
}

//location object constructor
var Places = function(data) {
    this.name = ko.observable(data.name);
    this.mapError = ko.observable('')
};

//konckout ViewModel
var ViewModel = function() {
    var self = this;
    self.locations = ko.observableArray();
    self.filter = ko.observableArray(self.locations());
    self.locationInput = ko.observable('');
    self.errorMessage = ko.observable('');
    self.temp = ko.observable('');

    //InforWindow object
    var largeInfowindow = new google.maps.InfoWindow();

    //filter list
    placesList.forEach(function(data) {
        var location = new Places(data);
        var position = placesList.location;
        var title = placesList.name;

        //Marker information
        var marker = new google.maps.Marker({
            position: data.location,
            map: map,
            title: data.name,
            animation: google.maps.Animation.DROP
        });

        //Marker and infowindow event listenter
        marker.addListener('click', function() {
            populateInfoWindow(this,largeInfowindow);
            
        });

        //Pushes marker to markers array
        location.marker = marker;
        self.locations.push(location);
    });

    //检测搜索输入
    this.inputData = ko.observable('');
    //Array Filter
    this.listFilter = ko.computed(function() {
        return ko.utils.arrayFilter(self.filter(),function(location) {
            if (location.name().toLowerCase().indexOf(self.locationInput().toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                return true;
            } else {
                location.marker.setVisible(false);
                return false;
            }
        });
    });

    //List view click event
    self.locationClicked = function(location) {
        google.maps.event.trigger(location.marker,'click');
    };

    //Populates infowindow
    function populateInfoWindow(marker,infowindow) {
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map,marker);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            },1400);

            //wiki API
            var wikiUrl = 'https://zh.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title +'&format=json&callback=wikiCallback';
            $.ajax({
                url:wikiUrl,
                type: 'GET',
                dataType:'jsonp',
                headers: { 'Api-User-Agent': 'Example/1.0' },
                success: function(response) {
                    var articleList = response[3];
                    var articleStr = articleList[0];
                    infowindow.setContent('<a href= "' + articleStr +'">' + "Wikipedia-" + marker.title + '</a>')
                    
                }
            });
                
            
        }
    }

    

    
};

//Google Mao error message
function googlemapError() {
    alert("Google Maps failed to load.");
    this.mapError('Google Maps failed to load.');
}