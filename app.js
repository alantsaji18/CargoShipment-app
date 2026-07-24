var app = angular.module('cargoApp', ['ngRoute']);

// ROUTE CONFIGURATION
app.config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider
        .when("/", {
            templateUrl: "views/home.html",
            controller: "HomeController"
        })
        .when("/login", {
            templateUrl: "views/login.html",
            controller: "LoginController"
        })
        .when("/register", {
            templateUrl: "views/register.html",
            controller: "RegisterController"
        })
        .when("/dashboard", {
            templateUrl: "views/dashboard.html",
            controller: "MainController",
            requiresAuth: true
        })
        .when("/shipments", {
            templateUrl: "views/shipments.html",
            controller: "MainController"
        })
        .when("/add", {
            templateUrl: "views/add.html",
            controller: "MainController",
            requiresAuth: true
        })
        .when("/demo", {
            templateUrl: "views/demo.html",
            controller: "MainController"
        })
        .otherwise({
            redirectTo: "/"
        });
});

// AUTHENTICATION SERVICE WITH REGISTRATION SUPPORT
app.service('AuthService', function() {
    var isAuthenticated = false;
    var currentUser = null;

    // Default users store
    var users = [
        { name: "Administrator", username: "admin", email: "admin@cargo.com", password: "123" }
    ];

    this.register = function(newUser) {
        // Check if username or email already exists
        var exists = users.some(function(u) {
            return u.username.toLowerCase() === newUser.username.toLowerCase() || 
                   u.email.toLowerCase() === newUser.email.toLowerCase();
        });

        if (exists) {
            return { success: false, message: "Username or Email already registered." };
        }

        users.push({
            name: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            password: newUser.password
        });

        return { success: true, message: "Account created successfully!" };
    };

    this.login = function(username, password) {
        var foundUser = users.find(function(u) {
            return (u.username === username || u.email === username) && u.password === password;
        });

        if (foundUser) {
            isAuthenticated = true;
            currentUser = foundUser;
            return true;
        }
        return false;
    };

    this.logout = function() {
        isAuthenticated = false;
        currentUser = null;
    };

    this.isLoggedIn = function() {
        return isAuthenticated;
    };

    this.getUser = function() {
        return currentUser;
    };
});

// SHARED SERVICE DATA STORE
app.service('ShipmentService', function() {
    this.shipments = [
        { id: 1, sender: "Amazon Logistics", receiver: "John Doe", status: "Delivered", origin: "Seattle, WA", destination: "Chicago, IL", mode: "Road", eta: "Jul 20, 2026" },
        { id: 2, sender: "Flipkart Express", receiver: "David Miller", status: "Pending", origin: "Mumbai, IN", destination: "Delhi, IN", mode: "Express", eta: "Jul 26, 2026" },
        { id: 3, sender: "Alibaba Express", receiver: "Chris Evans", status: "In Transit", origin: "Shanghai, CN", destination: "Hamburg, DE", mode: "Sea", eta: "Aug 02, 2026" },
        { id: 4, sender: "FedEx International", receiver: "Sarah Jenkins", status: "Delivered", origin: "Paris, FR", destination: "New York, US", mode: "Air", eta: "Jul 22, 2026" },
        { id: 5, sender: "DHL Express", receiver: "Michael Scott", status: "Delivered", origin: "Frankfurt, DE", destination: "London, UK", mode: "Air", eta: "Jul 23, 2026" }
    ];

    this.getShipments = function() {
        return this.shipments;
    };

    this.addShipment = function(item) {
        item.id = this.shipments.length + 1;
        item.origin = item.origin || "Headquarters";
        item.destination = item.destination || "Regional Hub";
        item.mode = item.mode || "Express";
        item.eta = item.eta || "Pending Assignment";
        this.shipments.push(item);
    };
});

// ROUTE GUARD (CHECK AUTHENTICATION)
app.run(function($rootScope, $location, AuthService) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next && next.requiresAuth && !AuthService.isLoggedIn()) {
            $location.path('/login');
        }
    });

    $rootScope.isLoggedIn = function() {
        return AuthService.isLoggedIn();
    };

    $rootScope.getCurrentUser = function() {
        return AuthService.getUser();
    };

    $rootScope.logout = function() {
        AuthService.logout();
        $location.path('/login');
    };
});

// CONTROLLERS
app.controller('HomeController', function($scope) {
    $scope.features = [
        { title: "Real-time Tracking", desc: "Monitor global shipments across air, sea, and land routes.", icon: "fa-location-arrow" },
        { title: "Secure Access", desc: "Role-based system controls for authorized operations staff.", icon: "fa-shield-alt" },
        { title: "Fast Dispatching", desc: "Instantly register and manage active supply chain deliveries.", icon: "fa-shipping-fast" }
    ];
});

app.controller('LoginController', function($scope, $location, AuthService) {
    $scope.credentials = { username: '', password: '' };
    $scope.errorMessage = '';

    $scope.login = function() {
        if (AuthService.login($scope.credentials.username, $scope.credentials.password)) {
            $scope.errorMessage = '';
            $location.path('/dashboard');
        } else {
            $scope.errorMessage = 'Invalid username/email or password.';
        }
    };
});

app.controller('RegisterController', function($scope, $location, $timeout, AuthService) {
    $scope.user = {};
    $scope.errorMessage = '';
    $scope.successMessage = '';

    $scope.register = function() {
        if ($scope.user.password !== $scope.user.confirmPassword) {
            $scope.errorMessage = "Passwords do not match.";
            return;
        }

        var result = AuthService.register($scope.user);

        if (result.success) {
            $scope.errorMessage = '';
            $scope.successMessage = result.message + " Redirecting to login...";
            $timeout(function() {
                $location.path('/login');
            }, 1800);
        } else {
            $scope.errorMessage = result.message;
        }
    };
});

app.controller('MainController', function($scope, $location, $timeout, ShipmentService) {
    $scope.shipments = ShipmentService.getShipments();
    $scope.newShipment = $scope.newShipment || {};

    $scope.addShipment = function() {
        if (!$scope.newShipment.sender || !$scope.newShipment.receiver || !$scope.newShipment.status) {
            alert("Please complete all required fields.");
            return;
        }

        ShipmentService.addShipment({
            sender: $scope.newShipment.sender,
            receiver: $scope.newShipment.receiver,
            status: $scope.newShipment.status,
            origin: $scope.newShipment.origin,
            destination: $scope.newShipment.destination,
            mode: $scope.newShipment.mode,
            eta: $scope.newShipment.eta
        });

        $scope.newShipment = {};

        $timeout(function() {
            $location.path("/shipments");
        });
    };
});