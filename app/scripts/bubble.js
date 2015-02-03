var bubbles = function() {
    var chart, clear, click, collide, collisionPadding, connectEvents, data, force, gravity, hashchange, height, idValue, jitter, label, margin, maxRadius, minCollisionRadius, mouseout, mouseover, node, rScale, rValue, textValue, tick, transformData, update, updateActive, updateLabels, updateNodes, width;
    width = 1440;
    height = 690;
    data = [];
    node = null;
    label = null;
    margin = {
    top: 5,
    right: 0,
    bottom: 0,
    left: 0
    };
    maxRadius = 120;
    rScale = d3.scale.sqrt().range([7, maxRadius]);
    rValue = function(d) {
        return parseInt(d.count);
    };
    idValue = function(d) {
        return d.name;
    };
    textValue = function(d) {
        return d.name;
    };
    collisionPadding = 10;
    minCollisionRadius = 10;
    jitter = 0.25;
    transformData = function(rawData) {
    rawData.forEach(function(d) {
      d.count = parseInt(d.count);
        return rawData.sort(function() {
            return 0.5 - Math.random();
      });
    });
    return rawData;
    };
    tick = function(e) {
        var dampenedAlpha;
        dampenedAlpha = e.alpha * 0.1;
        node.each(gravity(dampenedAlpha)).each(collide(jitter)).attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        });
        return label.style('left', function(d) {
          return ((margin.left + d.x) - d.dx / 2) + 'px';
        }).style('top', function(d) {
          return ((margin.top + d.y) - d.dy / 5) + 'px';
        });
    };
    force = d3.layout.force().gravity(0).charge(0).size([width, height]).on('tick', tick);
    chart = function(selection) {
        return selection.each(function(rawData) {
          var maxDomainValue, svg, svgEnter;
          data = transformData(rawData);
          maxDomainValue = d3.max(data, function(d) {
            return rValue(d);
          });
          rScale.domain([0, maxDomainValue]);
          svg = d3.select(this).selectAll('svg').data([data]);
          svgEnter = svg.enter().append('svg');
          svg.attr('width', width + margin.left + margin.right);
          svg.attr('height', height + margin.top + margin.bottom);
          node = svgEnter.append('g').attr('id', 'bubble-nodes').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
          node.append('rect').attr('id', 'bubble-background').attr('width', width).attr('height', height).on('click', clear);
          label = d3.select(this).selectAll('#bubble-labels').data([data]).enter().append('div').attr('id', 'bubble-labels');
          update();
          hashchange();
          return d3.select(window).on('hashchange', hashchange);
        });
    };
    update = function() {
        data.forEach(function(d, i) {
          d.forceR = Math.max(minCollisionRadius, rScale(rValue(d)));
        });
        force.nodes(data).start();
        updateNodes();
        return updateLabels();
    };
    updateNodes = function() {
        node = node.selectAll('.bubble-node').data(data, function(d) {
          return idValue(d);
        });
        node.exit().remove();
        return node.enter().append('a').attr('class', 'bubble-node').attr('xlink:href', function(d) {
          return '#' + (encodeURIComponent(idValue(d)));
        }).call(force.drag).call(connectEvents).append('circle').attr('r', function(d) {
          return rScale(rValue(d));
        });
    };
    updateLabels = function() {
        var labelEnter;
        label = label.selectAll('.bubble-label').data(data, function(d) {
          return idValue(d);
        });
        label.exit().remove();
        labelEnter = label.enter().append('a').attr('class', 'bubble-label').attr('href', function(d) {
          return '#' + (encodeURIComponent(idValue(d)));
        }).call(force.drag).call(connectEvents);
        labelEnter.append('div').attr('class', 'bubble-label-name').text(function(d) {
          return textValue(d);
        });
        labelEnter.append('div').attr('class', 'bubble-label-value').text(function(d) {
          return rValue(d);
        });
        label.style('font-size', function(d) {
          return Math.max(8, rScale(rValue(d)/20)) + 'px';
        }).style('width', function(d) {
          return .5 * rScale(rValue(d)) + 'px';
        });
        label.append('span').text(function(d) {
          return textValue(d);
        }).each(function(d) {
          d.dx = Math.max(2 * rScale(rValue(d)), this.getBoundingClientRect().width);
        }).remove();
        label.style('width', function(d) {
          return d.dx + 'px';
        });
        return label.each(function(d) {
          d.dy = this.getBoundingClientRect().height;
        });
    };
    gravity = function(alpha) {
        var ax, ay, cx, cy;
        cx = width / 2;
        cy = height / 2;
        ax = alpha / 8;
        ay = alpha;
        return function(d) {
          d.x += (cx - d.x) * ax;
          return d.y += (cy - d.y) * ay;
        };
    };
    collide = function(jitter) {
        return function(d) {
          return data.forEach(function(d2) {
            var distance, minDistance, moveX, moveY, x, y;
            if (d !== d2) {
              x = d.x - d2.x;
              y = d.y - d2.y;
              distance = Math.sqrt(x * x + y * y);
              minDistance = d.forceR + d2.forceR + collisionPadding;
              if (distance < minDistance) {
                distance = (distance - minDistance) / distance * jitter;
                moveX = x * distance;
                moveY = y * distance;
                d.x -= moveX;
                d.y -= moveY;
                d2.x += moveX;
                return d2.y += moveY;
              }
            }
          });
        };
    };
    connectEvents = function(d) {
        d.on('click', click);
        d.on('mouseover', mouseover);
        return d.on('mouseout', mouseout);
    };
    clear = function() {
        return location.replace('#');
    };
    click = function(d) {
        location.replace('#' + encodeURIComponent(idValue(d)));
        return d3.event.preventDefault();
    };
    hashchange = function() {
        var id;
        id = decodeURIComponent(location.hash.substring(1)).trim();
        return updateActive(id);
    };
    updateActive = function(id) {
        node.classed('bubble-selected', function(d) {
          return id === idValue(d);
        });
        if (id.length > 0 && id != 2) {
          $('#status')
            .addClass('nav-link-active')
            .html('Find your ' +id);
          $('.status-message-container').addClass('view-card');
          $('.next-button').fadeIn();
          $('.next-button').addClass('animated fadeInDown');
        } else {
          $('#status')
            .removeClass('nav-link-active')
            .html('What did you lose?');
          $('.status-message-container').removeClass('view-card');
          $('.next-button').hide();
        }
    };
    mouseover = function(d) {
        return node.classed('bubble-hover', function(p) {
          return p === d;
        });
    };
    mouseout = function(d) {
        return node.classed('bubble-hover', false);
    };
    chart.jitter = function(_) {
        if (!arguments.length) {
          return jitter;
        }
        jitter = _;
        force.start();
        return chart;
    };
    chart.height = function(_) {
        if (!arguments.length) {
          return height;
        }
        height = _;
        return chart;
    };
    chart.width = function(_) {
        if (!arguments.length) {
          return width;
        }
        width = _;
        return chart;
    };
    chart.r = function(_) {
        if (!arguments.length) {
          return rValue;
        }
        rValue = _;
        return chart;
    };
    return chart;
};

$(function() {
    var $main = $('.main-text'),
        plot = bubbles(),
        categoryObject = {};

    $main.on('click', '.nav-button', function(e) {
        e.preventDefault();
        var $targetPage = $('.page[data-page="2"]'),
            $previousPage = $('.page[data-page="1"]');
        $('.welcome-text').addClass('animated fadeOutLeft');
        $('.sub-text').addClass('animated fadeOutLeft');
        $('.welcome-text').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
            function() {
                $previousPage.hide();
                $targetPage.show();
                $('#vis').addClass('animated fadeInRight');
                $('.status-text').addClass('animated fadeInRight');

                $('#progress').css('width', '25%');
                setTimeout(function() {
                    $('.first').html('1. Choose a category');
                }, 800);
                window.location.hash = '2';
            }
        );
    });

    $main.on('click', '.view-card', function(e) {
        e.preventDefault();
        var $targetPage = $('.page[data-page="3"]'),
            $previousPage = $('.page[data-page="2"]'),
            category = decodeURIComponent(window.location.hash.substr(1));

        populateCard(category);

        $('#vis').addClass('animated fadeOutLeft');
        $('.status-text').addClass('animated fadeOutLeft');
        $('#vis').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
            function() {
                $previousPage.hide();
                $targetPage.show();
                $('#vis').removeClass('animated fadeInLeft');
                $('.next-button').removeClass('animated fadeInDown');
                $('.next-button').fadeOut();
                $('.status-text').removeClass('animated fadeInLeft');
                $('.card-container').addClass('bounceInRight');

                $('.first').html('2. Choose an item');
                $('#progress').css('width', '50%');
                window.location.hash = '3';
            }
        );
    });

    $main.on('click', '.card-link', function(e) {
        e.preventDefault();
        var $targetPage = $('.page[data-page="4"]'),
            $previousPage = $('.page[data-page="3"]'),
            item = $(e.target).data('item');

        $('.card-container').addClass('bounceOutLeft');
        $('.card-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
            function() {
                $previousPage.hide();
                $targetPage.show();
                $('.card-container').removeClass('bounceInRight');
                $('.card-container').removeClass('bounceOutLeft');

                $('#user-item').html(item);
                $('#user-form').addClass('animated fadeInRight');
                $('#user-form').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                    function() {
                        $('#user-name').focus();
                    }
                );

                $('.first').html('3. File a claim');
                $('#progress').css('width', '75%');
                window.location.hash = '4';
            }
        );
    });

    $main.on('click', '.submit-claim', function(e) {
        e.preventDefault();
        var $targetPage = $('.page[data-page="5"]'),
            $previousPage = $('.page[data-page="4"]'),
            userName = $('#user-name').val().split(' ')[0];

        if (isValidForm()) {
            $('#user-form').addClass('fadeOutLeft');
            $('#user-form').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                function() {
                    $previousPage.hide();
                    $targetPage.show();
                    initSpinner();
                    $('.first').html('Sending claim...');

                    $targetPage = $('.page[data-page="6"]');
                    $previousPage = $('.page[data-page="5"]');

                    setTimeout(function() {
                        $previousPage.hide();
                        $targetPage.fadeIn('slow');

                        $('#user-first-name').html(userName);
                        $('.thank-you-message').addClass('animated fadeInRight');

                        $('.first').html('Claim Completed');
                        $('#progress').css('width', '100%');
                        window.location.hash = '5';
                    }, 2000);
                }
            );
        }
    });

    $main.on('click', '.dismiss', function(e) {
        e.preventDefault();
        dismissCard();
    });

    var formTimeout,
        duration = 1000,
        stringValidation = /^[a-zA-Z]+$/,
        numberValidation = /^[0-9]+$/,
        phoneValidation = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/,
        emailValidation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        dateValidation = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
        
    var $error = $('#error-message');

    function hideError($el) {
        $el.css('border-bottom', '1px dotted #ced2d8');
        $error.html('');
        $error.hide();
    }

    function renderError($el, message) {
        $el.css('border-bottom', '1px dotted red');
        $error.html(message);
        $error.fadeIn('slow');
    }

    function isValidForm() {
        var $name = $('#user-name'),
            nameValue = $name.val(),
            validName = false,
            $phone = $('#user-phone'),
            phoneValue = $phone.val(),
            validPhone = false,
            $email = $('#user-email'),
            emailValue = $email.val(),
            validEmail = false,
            $zip = $('#user-zip'),
            zipValue = $zip.val(),
            validZip = false,
            $date = $('#user-travel-date'),
            dateValue = $date.val(),
            validDate = false,
            errorMessage = 'Please correct the errors below';

        if (nameValue.match(stringValidation)) {
            validName = true;
        } else {
            renderError($name, errorMessage);
        }
        if (phoneValue.match(phoneValidation)) {
            validPhone = true;
        } else {
            renderError($phone, errorMessage);
        }
        if (emailValue.match(emailValidation)) {
            validEmail = true;
        } else {
            renderError($email, errorMessage);
        }
        if (zipValue.match(numberValidation) && zipValue.length == 5) {
            validZip = true;
        } else {
            renderError($zip, errorMessage);
        }
        if (dateValue.match(dateValidation)) {
            validDate = true;
        } else {
            renderError($date, errorMessage);
        }

        if (validName && validPhone && validEmail && validZip && validDate) {
            return true;
        } else {
            $name.on('input', function() { hideError($name) });
            $phone.on('input', function() { hideError($phone) });
            $email.on('input', function() { hideError($email) });
            $zip.on('input', function() { hideError($zip) });
            $date.on('input', function() { hideError($date) });
        }
        return false;
    }  

    function renderPhoneSection(e) {
        var $targetInput = $('.form-section[data-section="2"]'),
            $name = $('#user-name'),
            nameValue = $name.val();

        hideError($name);

        if (formTimeout) { 
            clearTimeout(formTimeout); 
        }

        formTimeout = setTimeout(function() {
            if (nameValue.match(stringValidation)) {
                $targetInput.fadeIn('slow');
                $targetInput.find('input').focus();
            } else {
                renderError($name, 'Please enter a name with just characters');
            }
            formTimeout = undefined;
        }, duration);
    }

    function renderEmailSection(e) {
        var $targetInput = $('.form-section[data-section="3"]'),
            $phone = $('#user-phone'),
            phoneValue = $phone.val();
            
        $main.undelegate('#user-name', 'input', renderPhoneSection);

        hideError($phone);

        if (formTimeout) { 
            clearTimeout(formTimeout); 
        }

        formTimeout = setTimeout(function() {
            if (phoneValue.match(phoneValidation)) {
                $targetInput.fadeIn('slow');
                $targetInput.find('input').focus();
            } else {
                renderError($phone, 'Please enter a valid phone number');
            }
            formTimeout = undefined;
        }, duration);
    }

    function renderAddressSection(e) {
        var $targetInput = $('.form-section[data-section="4"]'),
            $email = $('#user-email'),
            emailValue = $email.val();
            
        $main.undelegate('#user-phone', 'input', renderEmailSection);

        hideError($email);

        if (formTimeout) { 
            clearTimeout(formTimeout); 
        }

        formTimeout = setTimeout(function() {
            if (emailValue.match(emailValidation)) {
                $targetInput.fadeIn('slow');
                $targetInput.find('#user-street-address').focus();
            } else {
                renderError($email, 'Please enter a valid email address');
            }
            formTimeout = undefined;
        }, duration);
    }

    function renderDateSection(e) {
        var $targetInput = $('.form-section[data-section="5"]'),
            $zip = $('#user-zip'),
            zipValue = $zip.val();
            
        $main.undelegate('#user-zip', 'input', renderTransportSection);

        hideError($zip);

        if (formTimeout) { 
            clearTimeout(formTimeout); 
        }

        formTimeout = setTimeout(function() {
            if (zipValue.match(numberValidation) && zipValue.length == 5) {
                $targetInput.fadeIn('slow');
                $targetInput.find('input').focus();
            } else {
                renderError($zip, 'Please enter only digits for Zip Code');
            }
            formTimeout = undefined;
        }, duration);
    }

    function renderTransportSection(e) {
        var $targetInput = $('.form-section[data-section="6"]'),
            $date = $('#user-travel-date'),
            dateValue = $date.val();

        hideError($date);

        if (formTimeout) { 
            clearTimeout(formTimeout); 
        }

        formTimeout = setTimeout(function() {
            if (dateValue.match(dateValidation)) {
                $targetInput.fadeIn('slow');
                $targetInput.css('display', 'inline-block');
                $targetInput.find('select').focus();
            } else {
                renderError($date, 'Enter a valid date: MM/DD/YYYY');
            }
            formTimeout = undefined;
        }, duration);
    }

    function renderSubmitButton(e) {
        var $button = $('.submit-claim-container');
        $main.undelegate('#user-transport', 'change', renderDateSection);

        if (formTimeout) { 
            clearTimeout(formTimeout); 
        }

        formTimeout = setTimeout(function() {
            $button.fadeIn('slow');
            formTimeout = undefined;
        }, duration);
    }

    $main.on('input', '#user-street-address', function(e) {
        $main.undelegate('#user-email', 'input', renderAddressSection);
    });

    $main.delegate('#user-name', 'input', renderPhoneSection);
    $main.delegate('#user-phone', 'input', renderEmailSection);
    $main.delegate('#user-email', 'input', renderAddressSection);
    $main.delegate('#user-zip', 'input', renderDateSection);
    $main.delegate('#user-travel-date', 'input', renderTransportSection);
    $main.delegate('#user-transport', 'change', renderSubmitButton);

    $('.card-container').addClass('animated bounceInRight');
    $('.nav-link').addClass('animated bounceInLeft');

    function initSpinner() {
        var target  = document.getElementById('loading-spinner'),
            opts = {
                lines: 9,
                radius: 30,
                speed: 1,
                corners: 1,
                className: 'spinner',
                direction: 1,
                color: '#FF9900',
                width: 10,
                length: 20
            },
            spinner = new Spinner(opts).spin(target);
    }

    function setPage(newPage, isBack) {
        if (newPage === 1) {
            window.location.hash = '';
        } else {
            window.location.hash = newPage;
        }
        renderPage(newPage, isBack);
    }

    function renderPage(page, isBack) {
        var $targetPage = $('.page[data-page="'+page+'"]'),
            $previousPage;

        if (page !== 1) {
            if (isBack) {
                $previousPage = $('.page[data-page="'+(page+1)+'"]');
            } else {
                $previousPage = $('.page[data-page="'+(page-1)+'"]');
            }
            $previousPage.hide();
        }

        $targetPage.fadeIn('slow');
    }

    function populateCard(category) {
        var $container = $('.subcategory-container'),
            $cardTitle = $('.card-title'),
            subCategories = categoryObject[category],
            name,
            count;

        $cardTitle.html(category);

        for (var i = 0; i < subCategories.length; i++) {
            name = subCategories[i].subCategoryName;
            count = subCategories[i].subCategoryCount;
            count = _numberWithCommas(count);

            var cardSub  = $('<div />')
                            .addClass('card-sub');
            var cardLink = $('<a />')
                            .addClass('card-link')
                            .data('item', name)
                            .html(name);
            var cardStat = $('<div />')
                            .addClass('card-stat')
                            .html(count);

            /* Add bottom margin to last subCategory element */
            if (i == subCategories.length - 1) {
                cardStat.css('margin-bottom', '20px');
            }
            $container.append(cardSub);
            cardSub.append(cardLink);
            $container.append(cardStat);
        }
    }

    function dismissCard() {
        var $targetPage = $('.page[data-page="2"]'),
            $previousPage = $('.page[data-page="3"]');
    
        $('.card-container').addClass('animated bounceOutRight');
        $('#vis').removeClass('animated fadeOutLeft');
        $('.status-text').removeClass('animated fadeOutLeft');
        $('#vis').removeClass('animated fadeInRight');
        $('.status-text').removeClass('animated fadeInRight');

        $('.card-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
            function() {
                $previousPage.hide();
                $targetPage.fadeIn('fast');
                $('.subcategory-container').html('');
                $('.card-container').removeClass('bounceOutRight');
                $('#vis').addClass('animated fadeInLeft');
                $('.status-text').addClass('animated fadeInLeft');

                $('.first').html('1. Choose a category');
                $('#progress').css('width', '25%');
                window.location.hash = '2';
            }
        );
    }

    function formatCategories(categories) {
        var result = [],
            name,
            count;
        for (var i = 0; i < categories.length; i++) {
            name = categories[i]['categoryName'];
            count = countSubcategories(categories[i]['subCategories']);

            name = formatCategoryName(name);

            categoryObject[name] = categories[i]['subCategories'];

            result.push({
                name: name,
                count: count
            });
        }
        return result;
    }

    function formatCategoryName(name) {
        switch (name) {
            case 'Carry Bag / Luggage':
                name = 'Luggage';
                break;
            case 'Cell Phone/Telephone/Communication Device':
                name = 'Cell Phones';
                break;
            case 'Entertainment (Music/Movies/Games)':
                name = 'Entertainment';
                break;
            case 'Medical Equipment & Medication':
                name = 'Medical Equipment';
                break;
            case 'NYCT Equipment':
                name = 'NYCT';
                break;
            case 'Clothing ':
                name = 'Clothing';
                break;
            default:
                break;
        }
        return name;
    }

    function countSubcategories(subCategories) {
        var count = 0,
        subCategoryCount;
        for (var i = 0; i < subCategories.length; i++) {
            subCategoryCount = parseInt(subCategories[i]['subCategoryCount']);
            count += subCategoryCount;
        }
        return count;
    }

    /* Helper functions */
    function _numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /* Render first view */
    setPage(1);

    // var seedData = [
    //     {
    //         categoryName: 'Cell Phones',
    //         subCategories: [
    //             {
    //                 subCategoryName: 'Mobile',
    //                 subCategoryCount: 456
    //             },
    //             {
    //                 subCategoryName: 'Home',
    //                 subCategoryCount: 783
    //             },
    //             {
    //                 subCategoryName: 'Landline',
    //                 subCategoryCount: 456
    //             },
    //             {
    //                 subCategoryName: 'Fax',
    //                 subCategoryCount: 456
    //             }
    //         ]
    //     },
    //     {
    //         categoryName: 'Television',
    //         subCategories: [
    //             {
    //                 subCategoryName: 'LG',
    //                 subCategoryCount: 888
    //             },
    //             {
    //                 subCategoryName: 'Samsung',
    //                 subCategoryCount: 888
    //             },
    //             {
    //                 subCategoryName: 'Sony',
    //                 subCategoryCount: 333
    //             },
    //             {
    //                 subCategoryName: 'Vizio',
    //                 subCategoryCount: 456
    //             }
    //         ]
    //     },
    //     {
    //         categoryName: 'Sports',
    //         subCategories: [
    //             {
    //                 subCategoryName: 'Football',
    //                 subCategoryCount: 999
    //             },
    //             {
    //                 subCategoryName: 'Basketball',
    //                 subCategoryCount: 111
    //             },
    //             {
    //                 subCategoryName: 'Soccer Ball',
    //                 subCategoryCount: 42
    //             },
    //             {
    //                 subCategoryName: 'Cricket Ball',
    //                 subCategoryCount: 778
    //             }
    //         ]
    //     },
    //     {
    //         categoryName: 'Clothing',
    //         subCategories: [
    //             {
    //                 subCategoryName: 'Jeans',
    //                 subCategoryCount: 54
    //             },
    //             {
    //                 subCategoryName: 'Shirt',
    //                 subCategoryCount: 73
    //             },
    //             {
    //                 subCategoryName: 'Shoes',
    //                 subCategoryCount: 111
    //             },
    //             {
    //                 subCategoryName: 'Socks',
    //                 subCategoryCount: 556
    //             }
    //         ]
    //     },
    //     {
    //         categoryName: 'Wallets',
    //         subCategories: [
    //             {
    //                 subCategoryName: 'Purse',
    //                 subCategoryCount: 989
    //             },
    //             {
    //                 subCategoryName: 'Murse',
    //                 subCategoryCount: 345
    //             },
    //             {
    //                 subCategoryName: 'Wallet',
    //                 subCategoryCount: 211
    //             },
    //             {
    //                 subCategoryName: 'Money Clip',
    //                 subCategoryCount: 142
    //             }
    //         ]
    //     }

    // ];

    /* Instantiate D3 Bubble Chart */
    d3.json(
        'http://default-environment-8k3maxsvf3.elasticbeanstalk.com/laf/latest', 
        function(data) {
            var newData = formatCategories(data['categories']);
            d3.select('#vis').datum(newData).call(plot);
        }
    );
    // var newData = formatCategories(seedData);
    // d3.select('#vis').datum(newData).call(plot);
});