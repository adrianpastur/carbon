import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import Immutable from 'immutable';
import GridRow from './grid_row';

describe('Grid Row', () => {
  let instance, noEvent, deleteInstance;
  let clickSpy = jasmine.createSpy('rowClick');
  let deleteSpy = jasmine.createSpy('rowDelete');

  beforeEach(() => {
    let fields = [{name: 'foo', displayName: 'Foo'},
                  {name: 'bar', className: 'customClass'}, 
                  {name: 'baz', displayName: 'BazBaz', align: 'right'}];

    let data = Immutable.fromJS({ _row_id: 'rowid', foo: '1', bar: '2', baz: '3' });

    let regularTable = document.createElement('table');
    let noEventTable = document.createElement('table');
    let deleteTable = document.createElement('table');
    regularTable.innerHTML = '<tbody></tbody>';
    noEventTable.innerHTML = '<tbody></tbody>';
    deleteTable.innerHTML = '<tbody></tbody>';

    instance = ReactDOM.render((
      <GridRow
        fields={ fields }
        data={ data }
        onRowClick={ clickSpy }
      />
    ), regularTable.children[0] );

    noEvent = ReactDOM.render((
      <GridRow
        fields={ fields }
        data={ data }
      />
    ), noEventTable.children[0] );

    deleteInstance = ReactDOM.render((
      <GridRow
        fields={ fields }
        data={ data }
        onRowDelete={ deleteSpy }
      />
    ), deleteTable.children[0] );
  })

  describe('handleRowClick', () => {
    describe('when a onRowClick function is NOT passed', () => {
      it('does not emit a click event', () => {
        let row = TestUtils.findRenderedDOMComponentWithTag(noEvent, 'tr');
        TestUtils.Simulate.click(row);
        expect(clickSpy).not.toHaveBeenCalled();
      });
    });

    describe('when a onRowClick function is passed', () => {
      it('is called when the row is clicked', () => {
        let row = TestUtils.findRenderedDOMComponentWithTag(instance, 'tr');
        TestUtils.Simulate.click(row);
        expect(clickSpy).toHaveBeenCalled();
      });
    });
  });

  describe('handleDeleteRow', () => {
    describe('when a onRowDelete function is passed', () => {
      it('is called when the delete button is clicked', () => {
        let deleteButton = TestUtils.scryRenderedDOMComponentsWithClass(deleteInstance, 'ui-grid-row__delete');
        TestUtils.Simulate.click(deleteButton[0]);
        expect(deleteSpy).toHaveBeenCalled();
      });
    });
  });

  describe('gridRowClasses', () => {
    it('extends from common grid decorator and sets base ui-grid__row class', () => {
      expect(instance.gridRowClasses).toEqual('common-grid__row ui-grid__row'); 
    });
  });

  describe('cells', () => {
    let cells;

    beforeEach(() => {
      cells = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'td'); 
    });

    it('renders a cell for every column in the row', () => {
      expect(cells.length).toEqual(3);
    });

    it('renders a the matches the data with the correct column', () => {
      expect(cells[0].textContent).toEqual('1');
      expect(cells[1].textContent).toEqual('2');
      expect(cells[2].textContent).toEqual('3');
    });

    describe('when a custom className is passed', () => {
      it('adds the custom className to the classList', () => {
        expect(cells[1].className).toEqual('common-grid__row__cell ui-grid__row__cell customClass');
      });
    });

    describe('when a align option is passed', () => {
      it('adds a align class to the specified side', () => {
        expect(cells[2].className).toEqual('common-grid__row__cell ui-grid__row__cell ui-grid__row__cell--align-right');
      });
    });

    describe('when a onRowDelete is passed', () => {
      it('adds a extra cell with a delete action', () => {
        cells = TestUtils.scryRenderedDOMComponentsWithTag(deleteInstance, 'td'); 
        expect(cells.length).toEqual(4);
        expect(cells[0].className).toEqual('common-grid__row__cell  common-grid__row__cell--actions ui-grid-row__cell--actions');
      });
    });
  });

  describe('render', () => {
    it('renders a html table row', () => {
      expect(TestUtils.findRenderedDOMComponentWithTag(instance, 'tr')).toBeTruthy();
      expect(TestUtils.findRenderedDOMComponentWithClass(instance, 'ui-grid__row')).toBeTruthy();
    });
  });
});