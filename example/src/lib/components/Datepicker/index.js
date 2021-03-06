import React, { Component } from 'react';
import styled from 'styled-components';
import DateUtilities from './utils';
import Calendar from './Calendar';

const StyledDatePicker = styled.div`
  position: fixed;
  box-sizing: border-box;
  z-index: 1500;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  padding: 16px 0px 0px;
  ${({ open }) => !open && 'display: none'};

  @media (max-width: 400px) {
    padding: 0 4px;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.54);
  will-change: opacity;
  transform: translateZ(0);
  transition: left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  z-index: 1400;
`;

const Dialog = styled.div`
  box-sizing: border-box;
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  position: relative;
  width: 100%;
  max-width: 479px;
  margin: 0px auto;
  z-index: 1500;
  opacity: 1;
  transform: translate(0px, 64px);
`;

const DialogInnerWrap = styled.div`
  color: rgba(0, 0, 0, 0.87);
  background-color: rgb(255, 255, 255);
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  box-sizing: border-box;
  font-family: Roboto, sans-serif;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px;
  border-radius: 2px;
`;

const DialogContent = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
  padding: 0px;
  box-sizing: border-box;
  overflow-y: hidden;
  border-top: none;
  border-bottom: none;
`;

class DatePicker extends Component {
  constructor(props) {
    super(props);
    var def = new Date(props.selected) || new Date();
    var selected = [];
    props.selected.forEach(date => {
      selected.push(new Date(date))
    })

    this.state = {
      view: DateUtilities.clone(def),
      selected: DateUtilities.clone(def),
      selectedDates: props.selected ? selected : [],
      minDate: null,
      maxDate: null,
      open: false,
    };
  }

  onSelect = day => {
    const { selectedDates } = this.state;
    if (DateUtilities.dateIn(selectedDates, day)) {
      this.setState({
        selectedDates: selectedDates.filter(date => !DateUtilities.isSameDay(date, day)),
      });
    } else {
      this.setState({ selectedDates: [...selectedDates, day] });
    }
  };

  onSetValue = (dates) => {
    let selected = [];
    dates.forEach(function (date) {
      selected.push(new Date(date));
    });
    this.setState({
      selectedDates: selected
    });
  };

  onSubmit = () => {};

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  handleCancel = (e) => {
    e.preventDefault()
    this.dismiss();
  };

  handleRequestClose = () => {
    this.dismiss();
  };

  handleOk = (e) => {
    e.preventDefault();
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.selectedDates);
    }

    this.setState({
      open: false,
    });
  };

  dismiss = () => {
    if (this.props.onDismiss && this.state.open) {
      this.props.onDismiss();
    }

    this.setState({
      open: false,
    });
  };

  render() {
    const { children } = this.props;

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var valueString = '';
    var dates = [];
    var sorted = this.state.selectedDates.sort(function(a,b){
      return new Date(a) - new Date(b);
    });
    sorted.forEach(date => {
      dates[date.getMonth()] ? dates[date.getMonth()].push(date) : dates[date.getMonth()] = [date]
    })
    dates.forEach((month, j)=> {
      month.forEach((date, i) => {
        var day = date.getDate();
        var string = 'th';
        switch (day) {
          case 1: string = 'st';break;
          case 2: string = 'nd';break;
          case 3: string = 'rd';break;
        }
        var semicolon = month.length == i+1 ? ' ' : month.length == i+2 ? ' and ' : ', ';
        valueString += day+string+semicolon
      })
      var semicolon = dates.length == j+1 ? '' : ', '
      valueString += monthNames[month[0].getMonth()]+semicolon
    })
    return (
      <div>
        {children ? (
          React.cloneElement(React.Children.only(children), {
            onClick: this.toggleOpen,
            value: valueString,
            readOnly: true,
          })
        ) : (
          <input
            type="text"
            readOnly
            value={this.state.selectedDates.map(date => DateUtilities.toString(date)).join(', ')}
            onClick={this.toggleOpen}
          />
        )}{' '}
        <StyledDatePicker open={this.state.open}>
          <Dialog>
            <DialogInnerWrap>
              <DialogContent>
                <Calendar
                  visible={this.state.visible}
                  view={this.state.view}
                  selected={this.state.selected}
                  selectedDates={this.state.selectedDates}
                  onSelect={this.onSelect}
                  minDate={this.props.minDate}
                  maxDate={this.props.maxDate}
                  onCancel={this.handleCancel}
                  onOk={this.handleOk}
                />
              </DialogContent>
            </DialogInnerWrap>
          </Dialog>
          <Backdrop />
        </StyledDatePicker>
      </div>
    );
  }
}

export default DatePicker;
