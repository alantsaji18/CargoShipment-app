var app = angular.module('cargoApp', ['ngRoute']);

// ==========================================
// ROUTE CONFIGURATION
// ==========================================
app.config(function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'DashboardController',
            requiresAuth: false
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController',
            requiresAuth: false
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'LoginController',
            requiresAuth: false
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController',
            requiresAuth: true
        })
        .when('/add', {
            templateUrl: 'views/add.html',
            controller: 'AddShipmentController',
            requiresAuth: true
        })
        .when('/shipments', {
            templateUrl: 'views/shipments.html',
            controller: 'ShipmentController',
            requiresAuth: true
        })
        .when('/demo', {
            templateUrl: 'views/demo.html',
            controller: 'HistoryController',
            requiresAuth: true
        })
        .otherwise({
            redirectTo: '/home'
        });
});

// ==========================================
// SHARED DATA FACTORY (WITH LOCALSTORAGE)
// ==========================================
app.factory('ShipmentService', function() {
    // 1. SHIPMENTS & HISTORY DATA
    var shipments = [
        { id: '101', trackingId: 'CRG-101', sender: 'Acme Logistics', receiver: 'Global Tech', origin: 'New York', destination: 'London', mode: 'Air', status: 'In Transit', weight: '350 kg', carrier: 'Emirates SkyCargo', cost: '1,250', eta: '2026-08-01' },
        { id: '102', trackingId: 'CRG-102', sender: 'LogiTrans Services', receiver: 'Nexus Retail', origin: 'Shanghai', destination: 'Hamburg', mode: 'Sea', status: 'Pending', weight: '1,200 kg', carrier: 'Maersk Line', cost: '3,400', eta: '2026-08-15' },
        { id: '103', trackingId: 'CRG-103', sender: 'FastTrack Ltd', receiver: 'Apex Distributors', origin: 'Tokyo', destination: 'Sydney', mode: 'Express', status: 'Delivered', weight: '45 kg', carrier: 'DHL Express', cost: '450', eta: '2026-07-20' },
        { id: '104', trackingId: 'CRG-104', sender: 'Vanguard Freight', receiver: 'EuroImports Gmbh', origin: 'Rotterdam', destination: 'Vienna', mode: 'Road', status: 'In Transit', weight: '890 kg', carrier: 'Schenker Logistics', cost: '980', eta: '2026-07-28' },
        { id: '105', trackingId: 'CRG-105', sender: 'Pacific Trade Co.', receiver: 'California Supply', origin: 'Singapore', destination: 'Los Angeles', mode: 'Sea', status: 'In Transit', weight: '2,400 kg', carrier: 'COSCO Shipping', cost: '4,100', eta: '2026-08-10' },
        { id: '106', trackingId: 'CRG-106', sender: 'Nordic Cargo Express', receiver: 'Polaris Industrial', origin: 'Oslo', destination: 'Stockholm', mode: 'Rail', status: 'In Transit', weight: '1,850 kg', carrier: 'Green Cargo', cost: '1,120', eta: '2026-07-30' },
        { id: '107', trackingId: 'CRG-107', sender: 'Atlas Freight Lines', receiver: 'Metropolis Hardware', origin: 'Chicago', destination: 'Toronto', mode: 'Road', status: 'Pending', weight: '620 kg', carrier: 'FedEx Freight', cost: '780', eta: '2026-08-04' },
        { id: '108', trackingId: 'CRG-108', sender: 'SilkRoad Express', receiver: 'Bosphorus Trading', origin: 'Dubai', destination: 'Istanbul', mode: 'Air', status: 'In Transit', weight: '510 kg', carrier: 'Turkish Cargo', cost: '1,890', eta: '2026-07-29' },
        { id: '109', trackingId: 'CRG-109', sender: 'Amazonas Maritime', receiver: 'Panama Central hub', origin: 'Santos', destination: 'Colon', mode: 'Sea', status: 'Pending', weight: '3,100 kg', carrier: 'Hapag-Lloyd', cost: '5,250', eta: '2026-08-22' }
    ];

    var historyData = [
        { trackingId: 'CRG-090', sender: 'Aero Cargo', receiver: 'Euro Mart', origin: 'Paris', destination: 'Berlin', mode: 'Road', carrier: 'DHL Freight', completedDate: '2026-06-12', status: 'Delivered', weight: '420 kg', cost: '850.00', notes: 'Arrived on schedule without customs delay.' },
        { trackingId: 'CRG-088', sender: 'Pacific Shipping', receiver: 'West Coast Supplies', origin: 'Singapore', destination: 'Los Angeles', mode: 'Sea', carrier: 'Maersk Line', completedDate: '2026-05-28', status: 'Delivered', weight: '2,100 kg', cost: '4,200.00', notes: 'Port inspection completed cleanly.' },
        { trackingId: 'CRG-085', sender: 'Balkan Express', receiver: 'Adria Logistics', origin: 'Athens', destination: 'Zagreb', mode: 'Road', carrier: 'Gebrüder Weiss', completedDate: '2026-05-14', status: 'Delivered', weight: '730 kg', cost: '1,100.00', notes: 'Border clearance completed in under 2 hours.' },
        { trackingId: 'CRG-082', sender: 'Trans-Alpine Rail', receiver: 'Lombardy Steel', origin: 'Zürich', destination: 'Milan', mode: 'Rail', carrier: 'SBB Cargo', completedDate: '2026-05-02', status: 'Delivered', weight: '4,500 kg', cost: '3,850.00', notes: 'Heavy machinery transport signed off by site manager.' },
        { trackingId: 'CRG-079', sender: 'Nippon Air Freight', receiver: 'Silicon Valley Devices', origin: 'Osaka', destination: 'San Francisco', mode: 'Air', carrier: 'ANA Cargo', completedDate: '2026-04-20', status: 'Delivered', weight: '180 kg', cost: '2,400.00', notes: 'Temperature-sensitive payload verified intact.' },
        { trackingId: 'CRG-075', sender: 'Iberia Cargo Services', receiver: 'Lisbon Retail Group', origin: 'Madrid', destination: 'Lisbon', mode: 'Road', carrier: 'Luís Simões', completedDate: '2026-04-11', status: 'Delivered', weight: '950 kg', cost: '620.00', notes: 'Standard pallet delivery completed.' },
        { trackingId: 'CRG-072', sender: 'Suez Maritime Corp', receiver: 'Alexandria Energy', origin: 'Marseille', destination: 'Alexandria', mode: 'Sea', carrier: 'CMA CGM', completedDate: '2026-03-30', status: 'Delivered', weight: '5,800 kg', cost: '6,900.00', notes: 'Full container load delivered to terminal B.' },
        { trackingId: 'CRG-068', sender: 'Caledonia Haulage', receiver: 'Highland Distillers', origin: 'Glasgow', destination: 'Belfast', mode: 'Road', carrier: 'Stena Line Freight', completedDate: '2026-03-18', status: 'Delivered', weight: '1,100 kg', cost: '940.00', notes: 'Ferry transfer completed on schedule.' },
        { trackingId: 'CRG-063', sender: 'Nordic Trans-Baltic', receiver: 'Estonia Components', origin: 'Helsinki', destination: 'Tallinn', mode: 'Sea', carrier: 'Tallink Silja Cargo', completedDate: '2026-03-05', status: 'Delivered', weight: '640 kg', cost: '580.00', notes: 'Direct port delivery verified by dispatch.' }
    ];

    // 2. LOAD USERS FROM LOCALSTORAGE
    var loadRegisteredUsers = function() {
        var stored = localStorage.getItem('cargo_users');
        if (stored) {
            return JSON.parse(stored);
        } else {
            // Default initial user
            var defaultUsers = [
                { name: 'Admin Operator', email: 'admin@cargo.com', password: 'password123' }
            ];
            localStorage.setItem('cargo_users', JSON.stringify(defaultUsers));
            return defaultUsers;
        }
    };

    // 3. LOAD CURRENT SESSION FROM LOCALSTORAGE
    var loadCurrentUser = function() {
        var savedUser = localStorage.getItem('cargo_currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    };

    var registeredUsers = loadRegisteredUsers();
    var currentUser = loadCurrentUser();

    return {
        getShipments: function() { return shipments; },
        addShipment: function(newShipment) { shipments.push(newShipment); },
        getHistory: function() { return historyData; },

        registerUser: function(newUser) {
            var exists = registeredUsers.some(function(u) {
                return u.email.toLowerCase() === newUser.email.toLowerCase();
            });
            if (exists) {
                return { success: false, message: 'An account with this email address already exists.' };
            }
            registeredUsers.push(newUser);
            // Save updated user array to localStorage
            localStorage.setItem('cargo_users', JSON.stringify(registeredUsers));
            return { success: true };
        },

        validateUser: function(email, password) {
            var user = registeredUsers.find(function(u) {
                return u.email.toLowerCase() === email.toLowerCase() && u.password === password;
            });
            return user || null;
        },

        setUser: function(user) { 
            currentUser = user; 
            if (user) {
                localStorage.setItem('cargo_currentUser', JSON.stringify(user));
            } else {
                localStorage.removeItem('cargo_currentUser');
            }
        },

        getUser: function() { return currentUser; },

        logout: function() { 
            currentUser = null; 
            localStorage.removeItem('cargo_currentUser');
        },

        isLoggedIn: function() { 
            return currentUser !== null; 
        }
    };
});

// ==========================================
// RUN BLOCK & ROUTE GUARD
// ==========================================
app.run(function($rootScope, $location, ShipmentService) {
    $rootScope.isLoggedIn = function() {
        return ShipmentService.isLoggedIn();
    };

    $rootScope.getCurrentUser = function() {
        return ShipmentService.getUser();
    };

    $rootScope.logout = function() {
        ShipmentService.logout();
        $location.path('/login');
    };

    // INTERCEPT ROUTE CHANGES FOR AUTHENTICATION
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next && next.$$route && next.$$route.requiresAuth) {
            if (!ShipmentService.isLoggedIn()) {
                event.preventDefault(); // Cancel route navigation
                $location.path('/login'); // Redirect to login page
            }
        }
    });
});

// ==========================================
// CONTROLLERS
// ==========================================

// 1. LOGIN & REGISTER CONTROLLER
app.controller('LoginController', function($scope, $location, ShipmentService) {
    $scope.credentials = { name: '', email: '', password: '' };
    $scope.authError = '';
    $scope.regSuccess = $location.search().registered === 'true';

    $scope.loginUser = function() {
        $scope.authError = '';
        $scope.regSuccess = false;

        if (!$scope.credentials.email || !$scope.credentials.password) {
            $scope.authError = 'Please enter both email and password.';
            return;
        }

        var matchedUser = ShipmentService.validateUser($scope.credentials.email, $scope.credentials.password);

        if (matchedUser) {
            ShipmentService.setUser({
                name: matchedUser.name || matchedUser.email.split('@')[0],
                email: matchedUser.email
            });
            $location.search({});
            $location.path('/dashboard');
        } else {
            $scope.authError = 'Invalid credentials. Please register first or check your details.';
        }
    };

    $scope.registerUser = function() {
        $scope.authError = '';

        if (!$scope.credentials.email || !$scope.credentials.password) {
            $scope.authError = 'Please complete all required fields.';
            return;
        }

        var result = ShipmentService.registerUser({
            name: $scope.credentials.name || 'Operator',
            email: $scope.credentials.email,
            password: $scope.credentials.password
        });

        if (result.success) {
            $location.path('/login').search({ registered: 'true' });
        } else {
            $scope.authError = result.message;
        }
    };
});

// 2. DASHBOARD CONTROLLER
app.controller('DashboardController', function($scope, ShipmentService) {
    $scope.shipments = ShipmentService.getShipments();
});

// 3. ADD SHIPMENT CONTROLLER
app.controller('AddShipmentController', function($scope, $location, ShipmentService) {
    $scope.newShipment = { 
        status: 'Pending',
        mode: 'Air',
        weight: '',
        cost: '1,200'
    };

    $scope.addShipment = function() {
        var randomId = Math.floor(110 + Math.random() * 890);
        $scope.newShipment.id = randomId;
        $scope.newShipment.trackingId = 'CRG-' + randomId;

        // Format ETA Date
        if ($scope.newShipment.etaDate) {
            var d = new Date($scope.newShipment.etaDate);
            $scope.newShipment.eta = d.toISOString().split('T')[0];
        } else {
            $scope.newShipment.eta = '2026-08-30';
        }

        ShipmentService.addShipment(angular.copy($scope.newShipment));
        $location.path('/shipments');
    };
});

// 4. SHIPMENT DIRECTORY CONTROLLER
app.controller('ShipmentController', function($scope, ShipmentService) {
    $scope.shipments = ShipmentService.getShipments();
    $scope.activeModalItem = {};
    $scope.searchTerm = '';

    $scope.selectShipment = function(shipment) {
        $scope.activeModalItem = shipment;
    };
});

// 5. HISTORY ARCHIVE CONTROLLER
app.controller('HistoryController', function($scope, ShipmentService) {
    $scope.historyList = ShipmentService.getHistory();
    $scope.selectedItem = {};
    $scope.searchQuery = '';

    $scope.openDetailModal = function(item) {
        $scope.selectedItem = item;
    };

    $scope.exportHistory = function() {
        alert('Audit Logs CSV Export initiated. All ' + $scope.historyList.length + ' archived records exported.');
    };
});