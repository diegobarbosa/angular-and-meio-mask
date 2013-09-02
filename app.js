/** https://github.com/jquery/jquery-migrate/blob/master/src/core.js#L50 */
if (!$.browser) {
    var uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        return match[2] || '0';
    };

    $.browser = {
        mozilla: /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase()),
        webkit: /webkit/.test(navigator.userAgent.toLowerCase()),
        opera: /opera/.test(navigator.userAgent.toLowerCase()),
        msie: /msie/.test(navigator.userAgent.toLowerCase()),
        version: uaMatch(navigator.userAgent)
    };
}

/** http://phpjs.org/functions/number_format/ */
function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

String.prototype.toMoney = function () {
    return number_format(this, 2, ',', '.');
};

function date_invert(val) {
    if (val) {
        var arr;
        if (val.indexOf('/') > 0) {
            arr = val.split('/');
            return arr[2] + '-' + arr[1] + '-' + arr[0];
        } else if (val.indexOf('-') > 0) {
            arr = val.split('-');
            return arr[2] + '/' + arr[1] + '/' + arr[0];
        }
    }
    return '';
}

var mulheres = angular.module('mulheres', []);

mulheres.directive('mask', ['$timeout', function ($timeout) {
    return {
        require: 'ngModel',
        link: function ($scope, $el, $attrs, ngModel) {
            if ($attrs.mask === 'time') {
                ngModel.$render = function () {
                    var val;
                    val = ngModel.$viewValue;
                    return $el.val(val ? val.substr(0, 5) : '');
                };
                $el.on('keyup.mask', function () {
                    var val;
                    val = $el.val();
                    return $timeout(function () {
                        return ngModel.$setViewValue(val.length === 5 ? val + ':00' : val);
                    }, 0);
                });
            } else if ($attrs.mask === 'date') {
                ngModel.$render = function () {
                    return $el.val(date_invert(ngModel.$viewValue));
                };
                $el.on('keyup.mask', function () {
                    return $timeout(function () {
                        return ngModel.$setViewValue(date_invert($el.val()));
                    }, 0);
                });
            } else if ($attrs.mask === 'decimal') {
                ngModel.$render = function () {
                    return $el.val(number_format(ngModel.$viewValue, 2, ',', '.'));
                };
                $el.on('keyup.mask', function () {
                    return $timeout(function () {
                        return ngModel.$setViewValue($el.val().replace('.', '').replace(',', '.'));
                    }, 0);
                });
            } else {
                $el.on('keyup.mask', function () {
                    return $timeout(function () {
                        return ngModel.$setViewValue($el.val());
                    }, 0);
                });
            }
            return $el.setMask($attrs.mask);
        }
    };
}]);

mulheres.filter('decimal', function () {
    return function (input) {
        return number_format(input, 2, ',', '.');
    };
});

mulheres.filter('date', function () {
    return function (input) {
        if (input) {
            return date_invert(input);
        } else {
            return '';
        }
    };
});

mulheres.controller('MulheresCtrl', function ($scope) {
    $scope.mulheres = [
        {
            nome: 'loirinha da esquina',
            valor: 150.00,
            telefone: '(12)3456-7890',
            nascimento: '1988-05-14'
        },
        {
            nome: 'pretinha de todos',
            valor: 100.00,
            telefone: '(12)3456-7890',
            nascimento: '1988-05-14'
        }
    ];
    $scope.mulher = {};

    $scope.edit = function (m) {
        $scope.mulher = m;
    };

    $scope.save = function () {
        $scope.mulheres.push($scope.mulher);
        $scope.mulher = {};
    };

    $scope.isActive = function (m) {
        return m === $scope.mulher;
    };
});