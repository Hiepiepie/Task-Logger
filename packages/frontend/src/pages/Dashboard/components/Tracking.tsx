import React from 'react';
import styled from 'styled-components';
import { Input } from '../../../components/Input/Input';
import { btnStates } from './ControlCard';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import moment from 'moment';
import axios from 'axios';

const TrackingContainer = styled.div`
  border: 1px solid rgb(230, 230, 230);
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  height: 72px;
  background-color: #ffffff;
  color: #000;
  margin-top: auto;
  margin-bottom: 10px;
`;
const CounterContainer = styled.div`
  margin-left: 5px;
  align-items: center;
  flex-grow: 1;
  display: flex;
  justify-content: center;
`;
const theme = () => ({
  root: {
    zIndex: 100,
    position: 'fixed' as 'fixed',
    bottom: '65px',
    width: '65vw',
  },
});

class Tracking extends React.Component<any, any> {
  private timerId: number | null = null;

  constructor(props: any) {
    super(props);
    this.state = {
      time: { hours: 0, minutes: 0, seconds: 0 },
      tracking: { task: null, btnState: 'idle' },
      dialogVisible: false,
      description: '',
    };
    this.counting = this.counting.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
    const { btnState, task } = this.props;
    if (prevProps !== this.props) {
      this.toggleTimer(task, btnState);
    }
  }

  // handle action on button clicked
  toggleTimer = (task: any, btnState: string) => {
    switch (btnState) {
      case btnStates.play: {
        if (task) {
          if (localStorage.getItem(`task_${task.id}`)) {
            // the following times
            // if exist a tracking in local storage, then get it and set time state.
            const i = localStorage.getItem(`task_${task.id}`);
            this.setState({
              time: {
                hours: parseInt(i!.split(':')[0]),
                minutes: parseInt(i!.split(':')[1]),
                seconds: parseInt(i!.split(':')[2]),
              },
            });
          } else {
            // the first time clicked on play
            this.setState({
              time: {
                hours: 0,
                seconds: 0,
                minutes: 0,
              },
            }); // save the startpoint
            localStorage.setItem(`startPoint_${task.id}`, moment(new Date()).add(1, 'hours').toISOString());
          } // save the id for clear interval
          this.timerId = setInterval(() => this.counting(task), 1000); // start counting
        }
        break;
      }
      case btnStates.pause: {
        clearInterval(this.timerId as number);
        break;
      }
      case btnStates.stop: {
        clearInterval(this.timerId as number);
        this.setState({
          dialogVisible: true,
        });
        break;
      }
    }
  };

  // counting logic handler
  counting = (task: any) => {
    // set time state and time in localstorage for every second
    const time = { ...this.state.time };
    time.seconds = time.seconds + 1;
    if (time.seconds === 60) {
      time.minutes = time.minutes + 1;
      time.seconds = 0;
    }
    if (time.minutes === 60) {
      time.hours = time.hours + 1;
      time.minutes = 0;
    }
    localStorage.setItem(`task_${task.id}`, `${time.hours}:${time.minutes}:${time.seconds}`);
    this.setState({
      time,
    });
  };
  // handle save after stop tracking
  handleSave = async () => {
    if (this.props.task) {
      const task = { ...this.props.task };
      const startPoint = new Date(localStorage.getItem(`startPoint_${task.id}`) as string);
      const endPoint = moment(startPoint)
        .add(this.state.time.hours, 'hours')
        .add(this.state.time.minutes, 'minutes')
        .add(this.state.time.seconds, 'seconds')
        .toDate();
      task.trackings.push({
        description: this.state.description,
        startTime: startPoint!.toISOString(),
        endTime: endPoint.toISOString(),
      });
      await axios.patch(`/task/${task.id}`, task);
      this.setState({
        dialogVisible: false,
        description: '',
      });
      localStorage.removeItem(`task_${task.id}`);
      localStorage.removeItem(`startPoint_${task.id}`);
    }
  };
  // change the value of description
  handleChange = (e: any) => {
    this.setState({
      description: e.target.value,
    });
  };
  // handle cancel clicked
  handleCancel = () => {
    this.setState({
      dialogVisible: false,
    });
  };

  render() {
    const time = this.state.time;
    const description = this.state.description;
    const { classes } = this.props;
    return (
      <TrackingContainer className={this.props.btnState === btnStates.play ? classes.root : ''}>
        <Input label={'What are you doing ?'} value={description} onChange={this.handleChange} />
        <CounterContainer>
          {('0' + time.hours).slice(-2)}:{('0' + time.minutes).slice(-2)}:{('0' + time.seconds).slice(-2)}
        </CounterContainer>
        {this.state.dialogVisible ? (
          <ConfirmationDialog title="Save Tracking" ok={this.handleSave} cancel={this.handleCancel}>
            <TextField
              multiline
              id="standard-multiline-static"
              label="What have you done ?"
              value={description}
              rows={4}
              onChange={this.handleChange}
            />
          </ConfirmationDialog>
        ) : null}
      </TrackingContainer>
    );
  }
}

export default withStyles(theme)(Tracking);
