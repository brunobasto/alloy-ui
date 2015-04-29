YUI.add('aui-gridster-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('aui-gridster'),
        gridster;

    suite.add(new Y.Test.Case({
        name: 'gridster',

        setUp: function() {
            gridster = new Y.Gridster({
                boundingBox: '#gridster'
            }).render();
        },

        tearDown: function() {
            gridster.get('cells').each(function(node) {
                node.setHTML('');
            });

            gridster.destructor();
            gridster = null;
        },

        'verify setting content on cells and verify emptiness': function() {
            var cells = gridster.get('cells');

            cells.each(function(node, counter) {
                node.setHTML('x');
                Assert.isFalse(gridster.isCellEmpty(counter), 'cell ' + counter + ' shouldn\'t be empty');
                node.setHTML('');
                Assert.isTrue(gridster.isCellEmpty(counter), 'cell ' + counter + ' should be empty');
            });
        },

        'verify cell availability': function() {
            var cells = gridster.get('cells'),
                notFree = [2, 3, 6, 7, 10, 11, 14, 15];

            gridster.set('spaces', [0, 1, 7, 7, 5, 5, 7, 7, 5, 5, 11, 11, 12, 13, 11, 11]);

            gridster.updatePositions();

            cells.item(11).setHTML('x');
            cells.item(7).setHTML('x');

            cells.each(function(node, counter) {
                var free = notFree.indexOf(counter) === -1,
                    available = gridster.isCellAvailable(counter);

                Assert.areSame(free, available, 'Cell ' + counter + ' availability: ' + free);
            });
        },

        'should update to grid with three large blocks positioned': function() {
            var cells = gridster.get('cells'),
                spaces = gridster.get('spaces'),
                levels = gridster.get('levels'),
                expectedSet,
                pos;

            spaces[15] = 11;
            spaces[14] = 11;
            spaces[10] = 11;

            spaces[4] = 5;
            spaces[8] = 5;
            spaces[9] = 5;

            spaces[2] = 7;
            spaces[3] = 7;
            spaces[6] = 7;

            gridster.on('positions-change', function(event) {
                var expectedSpaces = [0, 1, 7, 7, 5, 5, 7, 7, 5, 5, 11, 11, 12, 13, 11, 11];

                Y.ArrayAssert.itemsAreSame(expectedSpaces, event.details[0].spaces,
                    'Positions change event should expose current spaces.');
            });

            gridster.updatePositions();

            // block cell: [top, left, height, width, level]
            // hidden cell: undefined

            expectedSet = [
                ['0%', '0%', '25%', '25%', 1],
                ['0%', '25%', '25%', '25%', 1],
                undefined,
                undefined,
                undefined,
                ['25%', '0%', '50%', '50%', 2],
                undefined,
                ['0%', '50%', '50%', '50%', 2],
                undefined,
                undefined,
                undefined,
                ['50%', '50%', '50%', '50%', 2],
                ['75%', '0%', '25%', '25%', 1],
                ['75%', '25%', '25%', '25%', 1],
                undefined,
                undefined
            ];

            function testCell(number) {
                var expected = expectedSet[number],
                    cell = cells.item(number),
                    level = levels[number],
                    computedStyle = window.getComputedStyle(cell.getDOMNode());

                if (!expected) {
                    Assert.areSame('none', computedStyle.display, 'display for position ' + number);
                    Assert.areSame(0, level);
                    return;
                }

                Assert.areSame('block', computedStyle.display, 'display for position ' + number);
                Assert.areSame(expected[0], cell.getStyle('top'), 'top for position ' + number);
                Assert.areSame(expected[1], cell.getStyle('left'), 'left for position ' + number);
                Assert.areSame(expected[2], cell.getStyle('height'), 'height for position ' + number);
                Assert.areSame(expected[3], cell.getStyle('width'), 'width for position ' + number);
                Assert.areSame(expected[4], level);
            }

            for (pos = 0; pos < 16; pos += 1) {
                testCell(pos);
            }
        },

        'should have only base / small blocks positioned': function() {
            var cells = gridster.get('cells'),
                expectedSet,
                pos;

            // cell: [top, left, height, width]

            expectedSet = [
                ['0%', '0%', '25%', '25%'],
                ['0%', '25%', '25%', '25%'],
                ['0%', '50%', '25%', '25%'],
                ['0%', '75%', '25%', '25%'],
                ['25%', '0%', '25%', '25%'],
                ['25%', '25%', '25%', '25%'],
                ['25%', '50%', '25%', '25%'],
                ['25%', '75%', '25%', '25%'],
                ['50%', '0%', '25%', '25%'],
                ['50%', '25%', '25%', '25%'],
                ['50%', '50%', '25%', '25%'],
                ['50%', '75%', '25%', '25%'],
                ['75%', '0%', '25%', '25%'],
                ['75%', '25%', '25%', '25%'],
                ['75%', '50%', '25%', '25%'],
                ['75%', '75%', '25%', '25%']
            ];

            function testCell (number) {
                var expected = expectedSet[number],
                    cell = cells.item(number),
                    computedStyle = window.getComputedStyle(cell.getDOMNode());

                Assert.areSame('block', computedStyle.display, 'display for position ' + number);
                Assert.areSame(expected[0], cell.getStyle('top'), 'top for position ' + number);
                Assert.areSame(expected[1], cell.getStyle('left'), 'left for position ' + number);
                Assert.areSame(expected[2], cell.getStyle('height'), 'height for position ' + number);
                Assert.areSame(expected[3], cell.getStyle('width'), 'width for position ' + number);
            }

            for (pos = 0; pos < 16; pos += 1) {
                testCell(pos);
            }
        },

        'should not listen to controller-sync event when controller is off': function() {
            var cell = gridster.get('cells').item(8),
                fired = false;

            gridster.once('controller-sync', function() {
                fired = true;
            });

            cell.simulate('mouseover');

            Assert.isFalse(fired, 'Controller movement should not fire');
        },

        'should listen to mouse over cell event and trigger controller': function() {
            var cell = gridster.get('cells').item(8),
                fired;

            gridster.set('showController', true);

            gridster.once('controller-sync', function() {
                fired = true;
            });

            cell.simulate('mouseover');

            Assert.isTrue(fired, 'Controller movement fired');
        },

        'should listen to mouse leaving gridster': function() {
            gridster.get('boundingBox').simulate('mouseout');
        },

        'should have arrows as NodeList': function() {
            Assert.isTrue(gridster.get('arrows') instanceof Y.NodeList);
        },

        'should have arrows for all 4 directions and 1 reset': function() {
            var directions,
                arrows = gridster.get('arrows'),
                amount = 0,
                key;

            directions = {
                BottomRight: false,
                BottomLeft: false,
                TopRight: false,
                TopLeft: false
            };

            arrows.each(function(arrow) {
                directions[arrow.getData('direction')] = true;
                amount += 1;
            });

            Assert.areSame(amount, 5, 'Amount of buttons');

            for (key in directions) {
                if (directions.hasOwnProperty(key)) {
                    Assert.isTrue(directions[key]);
                }
            }
        },

        'should have arrows to the SE only for the 0th cell': function() {
            var arrows = gridster.get('arrows'),
                cell = gridster.get('cells').item(0),
                expectedSet = {
                    BottomRight: true,
                    BottomLeft: false,
                    TopRight: false,
                    TopLeft: false,
                    Break: false
                };

            gridster.set('showController', true);

            cell.simulate('mouseover');

            function verify(arrow) {
                var direction = arrow.getData('direction'),
                    expected = expectedSet[direction],
                    display = false;

                if (arrow.getStyle('display') !== 'none') {
                    display = true;
                }

                Assert.areSame(expected, display,
                    direction + ' arrow should be displayed: ' + expected + ' for cell ' + cell);
            }

            arrows.each(verify, this);
        },

        'should be able to hide shown controllers': function() {
            var arrows = gridster.get('arrows'),
                cells = gridster.get('cells'),
                spaces = gridster.get('spaces'),
                cell = 5,
                counter;

            gridster.set('showController', true);

            spaces[6] = 5;
            spaces[9] = 5;
            spaces[10] = 5;

            gridster.updatePositions();


            cells.item(cell).simulate('mouseover');

            for (counter = 0; counter < 5; counter += 1) {
                Assert.areSame('block', arrows.item(counter).getStyle('display'));
            }

            gridster.set('showController', false);

            for (counter = 0; counter < 5; counter += 1) {
                Assert.areSame('none', arrows.item(counter).getStyle('display'));
            }
        },

        'should add arrows only when adjacent cells are available': function() {
            var cells = gridster.get('cells'),
                spaces = gridster.get('spaces'),
                arrows = gridster.get('arrows');

            gridster.set('showController', true);

            function verifyArrow(type, direction, cell) {
                var arrow,
                    counter;

                // Better to get the wanted arrow directly instead of looping
                for (counter = 0; counter < 5; counter += 1) {
                    arrow = arrows.item(counter);

                    if (arrow.getData('direction') !== direction) {
                        continue;
                    }

                    Assert.areSame(type, arrow.getStyle('display'),
                        'Display for ' + arrow.getData('direction') +
                        ' arrow should be ' + type + ' on cell ' + cell);
                }
            }

            function testArrowBlockingByCell(direction, blockingCell, cell) {
                cells.item(blockingCell).setHTML('x');
                cells.item(cell).simulate('mouseover');
                verifyArrow('none', direction, cell);
                cells.item(blockingCell).setHTML('');
            }

            function resetSpaces() {
                var counter;

                for (counter = 0; counter < 16; counter += 1) {
                    spaces[counter] = counter;
                }
            }

            function testBlockPositions(block, direction, blockingCells) {
                block.forEach(function() {
                    var places = arguments[2],
                        cell = arguments[0];

                    resetSpaces();

                    places.forEach(function(place) {
                        spaces[place] = cell;
                    });

                    gridster.updatePositions();

                    cells.item(cell).simulate('mouseover');
                    verifyArrow('block', direction, cell);

                    blockingCells.forEach(function(blockingCell) {
                        testArrowBlockingByCell(direction, blockingCell, cell);
                    });
                });
            }

            testBlockPositions([3], 'BottomLeft', [2, 6, 7]);
            testBlockPositions([2, 3, 6, 7], 'BottomLeft', [1, 5, 9, 10, 11]);
            testBlockPositions([1, 2, 3, 5, 6, 7, 9, 10, 11], 'BottomLeft', [0, 4, 8, 12, 13, 14, 15]);

            testBlockPositions([9], 'TopRight', [5, 6, 10]);
            testBlockPositions([8, 9, 12, 13], 'TopRight', [4, 5, 6, 10, 14]);
            testBlockPositions([4, 5, 6, 8, 9, 10, 12, 13, 14], 'TopRight', [0, 1, 2, 3, 7, 11, 15]);

            testBlockPositions([10], 'TopLeft', [5, 6, 9]);
            testBlockPositions([10, 11, 14, 15], 'TopLeft', [5, 6, 7, 9, 13]);
            testBlockPositions([5, 6, 7, 9, 10, 11, 13, 14, 15], 'TopLeft', [0, 1, 2, 3, 4, 8, 12]);

            testBlockPositions([5], 'BottomRight', [6, 9, 10]);
            testBlockPositions([5, 6, 9, 10], 'BottomRight', [7, 11, 13, 14, 15]);
            testBlockPositions([0, 1, 2, 4, 5, 6, 8, 9, 10], 'BottomRight', [3, 7, 11, 12, 13, 14, 15]);
        },

        'should have arrows limited by the edge boundaries and breaks': function() {
            var arrows = gridster.get('arrows'),
                cells = gridster.get('cells'),
                cell,
                arrowsCellSet,
                arrowsExpectedPos;

            gridster.set('showController', true);

            gridster.set('spaces', [0, 1, 7, 7, 5, 5, 7, 7, 5, 5, 11, 11, 12, 13, 11, 11]);

            gridster.updatePositions();

            arrowsCellSet = {
                BottomRight: [0, 1, 5],
                BottomLeft: [1, 7],
                TopRight: [5, 12, 13],
                TopLeft: [11, 13],
                Break: [5, 7, 11]
            };

            arrowsExpectedPos = {
                BottomRight: {
                    0: {
                        top: 20,
                        left: 20
                    },
                    1: {
                        top: 20,
                        left: 45
                    },
                    5: {
                        top: 70,
                        left: 45
                    }
                },
                BottomLeft: {
                    1: {
                        top: 20,
                        left: 25
                    },
                    7: {
                        top: 45,
                        left: 50
                    }
                },
                TopRight: {
                    5: {
                        top: 25,
                        left: 45
                    },
                    12: {
                        top: 75,
                        left: 20
                    },
                    13: {
                        top: 75,
                        left: 45
                    }
                },
                TopLeft: {
                    11: {
                        top: 50,
                        left: 50
                    },
                    13: {
                        top: 75,
                        left: 25
                    }
                },
                Break: {
                    5: {
                        top: 47,
                        left: 22
                    },
                    7: {
                        top: 22,
                        left: 72
                    },
                    11: {
                        top: 72,
                        left: 72
                    }
                }
            };

            function verify(arrow) {
                var direction = arrow.getData('direction'),
                    expectDisplay = arrowsCellSet[direction].indexOf(cell) !== -1,
                    position = arrowsExpectedPos[direction][cell],
                    display = false,
                    actualTop,
                    actualLeft;

                if (arrow.getStyle('display') !== 'none') {
                    display = true;
                }

                Assert.areSame(expectDisplay, display,
                    direction + ' arrow displayed: ' + expectDisplay + ' for cell ' + cell);

                if (!display) {
                    return;
                }

                actualTop = arrow.getStyle('top');
                actualLeft = arrow.getStyle('left');

                actualTop = Math.floor(actualTop.substring(0, actualTop.length - 1));
                actualLeft = Math.floor(actualLeft.substring(0, actualLeft.length - 1));

                Assert.areSame(position.top, actualTop,
                    direction + ' point top position for cell ' + cell);

                Assert.areSame(position.left, actualLeft,
                    direction + ' point left position for cell ' + cell);
            }

            for (cell = 0; cell < 16; cell += 1) {
                cells.item(cell).simulate('mouseover');
                arrows.each(verify, this);
            }
        },

        'expand blocks': function() {
            var arrows = gridster.get('arrows'),
                cells = gridster.get('cells'),
                spaces = gridster.get('spaces'),
                steps = [],
                expected = [];

            function getArrow(direction) {
                return arrows.filter('[data-direction="' + direction + '"]').item(0);
            }

            gridster.set('showController', true);

            steps.push([7, 'BottomLeft']);
            expected.push([0, 1, 2, 3, 4, 5, 7, 7, 8, 9, 7, 7, 12, 13, 14, 15]);

            steps.push([7, 'BottomLeft']);
            expected.push([0, 1, 2, 3, 4, 7, 7, 7, 8, 7, 7, 7, 12, 7, 7, 7]);

            steps.push([0, 'BottomRight']);
            expected.push([0, 0, 2, 3, 0, 0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

            steps.push([10, 'BottomRight']);
            expected.push([0, 0, 2, 3, 0, 0, 6, 7, 8, 9, 10, 10, 12, 13, 10, 10]);

            steps.push([0, 'BottomRight']);
            expected.push([0, 0, 0, 3, 0, 0, 0, 7, 0, 0, 0, 11, 12, 13, 14, 15]);

            steps.push([15, 'TopLeft']);
            expected.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 15, 12, 13, 15, 15]);

            steps.push([9, 'TopLeft']);
            expected.push([0, 1, 2, 3, 9, 9, 6, 7, 9, 9, 15, 15, 12, 13, 15, 15]);

            steps.push([13, 'TopRight']);
            expected.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 13, 13, 11, 12, 13, 13, 15]);

            steps.push([6, 'TopRight']);
            expected.push([0, 1, 6, 6, 4, 5, 6, 6, 8, 13, 13, 11, 12, 13, 13, 15]);

            steps.push([13, 'TopRight']);
            expected.push([0, 1, 2, 3, 4, 13, 13, 13, 8, 13, 13, 13, 12, 13, 13, 13]);

            steps.push([2, 'BottomRight']);
            expected.push([0, 1, 2, 2, 4, 5, 2, 2, 8, 9, 10, 11, 12, 13, 14, 15]);

            steps.push([2, 'Break']);
            expected.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

            steps.push([4, 'BottomRight']);
            expected.push([0, 1, 2, 3, 4, 4, 6, 7, 4, 4, 10, 11, 12, 13, 14, 15]);

            steps.push([6, 'BottomRight']);
            expected.push([0, 1, 2, 3, 4, 4, 6, 6, 4, 4, 6, 6, 12, 13, 14, 15]);

            steps.push([6, 'TopLeft']);
            expected.push([0, 6, 6, 6, 4, 6, 6, 6, 8, 6, 6, 6, 12, 13, 14, 15]);

            steps.push([6, 'Break']);
            expected.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

            steps.push([4, 'BottomRight']);
            expected.push([0, 1, 2, 3, 4, 4, 6, 7, 4, 4, 10, 11, 12, 13, 14, 15]);

            steps.push([6, 'BottomRight']);
            expected.push([0, 1, 2, 3, 4, 4, 6, 6, 4, 4, 6, 6, 12, 13, 14, 15]);

            steps.push([6, 'TopLeft']);
            expected.push([0, 6, 6, 6, 4, 6, 6, 6, 8, 6, 6, 6, 12, 13, 14, 15]);

            steps.push([6, 'BottomLeft']);
            expected.push([6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]);

            steps.push([6, 'Break']);
            expected.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

            steps.push([15, 'TopLeft']);
            expected.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 15, 12, 13, 15, 15]);

            steps.push([15, 'TopLeft']);
            expected.push([0, 1, 2, 3, 4, 15, 15, 15, 8, 15, 15, 15, 12, 15, 15, 15]);

            steps.push([15, 'TopLeft']);
            expected.push([15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]);

            steps.push([15, 'Break']);
            expected.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

            steps.push([9, 'TopRight']);
            expected.push([0, 1, 2, 3, 4, 9, 9, 7, 8, 9, 9, 11, 12, 13, 14, 15]);

            steps.push([9, 'BottomLeft']);
            expected.push([0, 1, 2, 3, 9, 9, 9, 7, 9, 9, 9, 11, 9, 9, 9, 15]);

            steps.push([9, 'TopRight']);
            expected.push([9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]);

            steps.push([9, 'Break']);
            expected.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

            steps.push([0, 'BottomRight']);
            expected.push([0, 0, 2, 3, 0, 0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

            steps.push([0, 'BottomRight']);
            expected.push([0, 0, 0, 3, 0, 0, 0, 7, 0, 0, 0, 11, 12, 13, 14, 15]);

            steps.push([0, 'BottomRight']);
            expected.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

            steps.forEach(function(params, step) {
                var arrow = getArrow(params[1]),
                    cell = cells.item(params[0]);

                cell.simulate('mouseover');
                arrow.simulate('click');
                Assert.areSame('block', arrow.getStyle('display'));
                Y.ArrayAssert.itemsAreSame(expected[step], spaces);
            });
        },

        'should have arrows limited by the edge boundaries when controller is on': function() {
            var arrows = gridster.get('arrows'),
                cells = gridster.get('cells'),
                cell,
                expectedSet = {
                    BottomRight: [0, 1, 2, 4, 5, 6, 8, 9, 10],
                    BottomLeft: [1, 2, 3, 5, 6, 7, 9, 10, 11],
                    TopRight: [4, 5, 6, 8, 9, 10, 12, 13, 14],
                    TopLeft: [5, 6, 7, 9, 10, 11, 13, 14, 15],
                    Break: []
                };

            function verify(arrow) {
                var direction = arrow.getData('direction'),
                    expected = expectedSet[direction].indexOf(cell) !== -1,
                    display = false;

                if (arrow.getStyle('display') !== 'none') {
                    display = true;
                }

                Assert.areSame(expected, display,
                    direction + ' arrow should be displayed: ' + expected + ' for cell ' + cell);
            }

            gridster.set('showController', true);

            for (cell = 0; cell < 16; cell += 1) {
                cells.item(cell).simulate('mouseover');
                arrows.each(verify, this);
            }
        },

        'should hide arrows if active cell is in hidden state': function() {
            var spaces = gridster.get('spaces'),
                arrows = gridster.get('arrows');

                spaces[6] = 5;
                spaces[9] = 5;
                spaces[10] = 5;

                gridster.updatePositions();

                gridster.syncControllerToCell(6);

                Assert.isTrue(Y.Array.every(arrows.getStyle('display'), function(actual) {
                    return actual === 'none';
                }), 'Arrows should not be displayed on top of not visible cell');
        },

        'should get groupings': function() {
            var spaces = gridster.get('spaces'),
                groupings = [
                    [0], [1], [], [],
                    [], [4, 5, 8, 9],
                    [], [2, 3, 6, 7], [], [], [],
                    [10, 11, 14, 15],
                    [12], [13], [], []
                ],
                counter;

            spaces[15] = 11;
            spaces[14] = 11;
            spaces[10] = 11;

            spaces[4] = 5;
            spaces[8] = 5;
            spaces[9] = 5;

            spaces[2] = 7;
            spaces[3] = 7;
            spaces[6] = 7;

            gridster.updatePositions();

            function areSameArray(expected, actual) {
                Assert.areSame(expected.length, actual.length);
                Assert.isTrue(actual.every(function(element, index) {
                    return element === expected[index];
                }));
            }

            for (counter = 0; counter < 16; counter += 1) {
                areSameArray(groupings[counter], gridster.getGrouping(counter));
            }
        },

        'should break bricks with area larger than one': function() {
            var grouping,
                groupings = [
                    [0], [1], [2], [3], [],
                    [4, 5, 8, 9],
                    [6], [7], [], [], [],
                    [10, 11, 14, 15],
                    [12], [13], [], []
                ],
                counter;

            // remove default gridster with regular bricks
            gridster.destructor();

            gridster = new Y.Gridster({
                boundingBox: '#gridster',
                spaces: [0, 1, 7, 7, 5, 5, 7, 7, 5, 5, 11, 11, 12, 13, 11, 11]
            }).render();

            grouping = gridster.getGrouping(7);

            Assert.areSame(4, grouping.length);

            gridster.breakBrick(7);

            grouping = gridster.getGrouping(7);

            Assert.areSame(1, grouping.length);
            Assert.areSame(7, grouping[0]);

            function areSameArray(expected, actual) {
                Assert.areSame(expected.length, actual.length);
                Assert.isTrue(actual.every(function(element, index) {
                    return element === expected[index];
                }));
            }

            for (counter = 0; counter < 16; counter += 1) {
                areSameArray(groupings[counter], gridster.getGrouping(counter));
            }
        },

        'should break bricks on clicking on the break button': function() {
            var spaces = gridster.get('spaces'),
                levels = gridster.get('levels'),
                cells = gridster.get('cells'),
                brickCell = cells.item(11),
                listened,
                expectedSet,
                pos;

            gridster.set('showController', true);

            spaces[15] = 11;
            spaces[14] = 11;
            spaces[10] = 11;

            spaces[4] = 5;
            spaces[8] = 5;
            spaces[9] = 5;

            spaces[2] = 7;
            spaces[3] = 7;
            spaces[6] = 7;

            gridster.updatePositions();

            // block cell: [top, left, height, width, level]
            // hidden cell: undefined

            expectedSet = [
                ['0%', '0%', '25%', '25%', 1],
                ['0%', '25%', '25%', '25%', 1],
                undefined,
                undefined,
                undefined,
                ['25%', '0%', '50%', '50%', 2],
                undefined,
                ['0%', '50%', '50%', '50%', 2],
                undefined,
                undefined,
                ['50%', '50%', '25%', '25%', 1],
                ['50%', '75%', '25%', '25%', 1],
                ['75%', '0%', '25%', '25%', 1],
                ['75%', '25%', '25%', '25%', 1],
                ['75%', '50%', '25%', '25%', 1],
                ['75%', '75%', '25%', '25%', 1]
            ];

            function testCell(number) {
                var expected = expectedSet[number],
                    cell = cells.item(number),
                    level = levels[number],
                    computedStyle = window.getComputedStyle(cell.getDOMNode());

                if (!expected) {
                    Assert.areSame('none', computedStyle.display, 'display for position ' + number);
                    Assert.areSame(0, level);
                    return;
                }

                Assert.areSame('block', computedStyle.display, 'display for position ' + number);
                Assert.areSame(expected[0], cell.getStyle('top'), 'top for position ' + number);
                Assert.areSame(expected[1], cell.getStyle('left'), 'left for position ' + number);
                Assert.areSame(expected[2], cell.getStyle('height'), 'height for position ' + number);
                Assert.areSame(expected[3], cell.getStyle('width'), 'width for position ' + number);
                Assert.areSame(expected[4], level);
            }

            function breakActionListener() {
                var expectedSpaces = [0, 1, 7, 7, 5, 5, 7, 7, 5, 5, 10, 11, 12, 13, 14, 15],
                    expectedLevels = [1, 1, 0, 0, 0, 2, 0, 2, 0, 0, 1, 1, 1, 1, 1, 1];

                Assert.isTrue(listened, 'Grid block breaks');
                Y.ArrayAssert.itemsAreSame(expectedSpaces, spaces);
                Y.ArrayAssert.itemsAreSame(expectedLevels, levels);

                for (pos = 0; pos < 16; pos += 1) {
                    testCell(pos);
                }
            }

            gridster.once('controller-action-Break', function() {
                listened = true;
            });

            gridster.once('controller-sync', function() {
                Y.one('.gridster-controller-arrows [data-direction="Break"]').simulate('click');
            }, this);

            brickCell.simulate('mouseover');

            this.wait(breakActionListener, 0);
        },

        'should remove controller node on gridster destruction': function() {
            var controllerNode = gridster.get('controllerNode');

            gridster.destructor();

            Assert.isNull(controllerNode.get('parentNode'));
            Assert.isNull(Y.one('.gridster-controller-arrows'));

            // avoid error message due to invoking destructor at teardown also
            gridster = new Y.Gridster({
                boundingBox: '#gridster'
            }).render();
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'aui-gridster', 'node-screen', 'node-event-simulate']
});
