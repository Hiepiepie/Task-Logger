import React, { useEffect, useState } from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  Card,
  CardContent,
  IconButton,
  Typography,
  Tooltip,
  Chip,
} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Delete, Pause, Settings, StopRounded } from '@material-ui/icons';
import { Link } from 'react-router-dom';

export const btnStates = {
  pause: 'pause',
  play: 'play',
  idle: 'idle',
  stop: 'stop',
};
const ControlCard = (props: any) => {
  const classes = useStyles();
  const [btnState, setBtnState] = useState(btnStates.idle);
  useEffect(() => {
    setBtnState(btnStates.idle);
  }, [props.task]);

  const handleStartPause = () => {
    setBtnState(
      [btnStates.pause, btnStates.idle, btnStates.stop].includes(btnState) ? btnStates.play : btnStates.pause,
    );
    const clickCallback = props.hasOwnProperty('btnState') ? props.btnState : null;
    if (typeof clickCallback === 'function') {
      clickCallback(
        [btnStates.pause, btnStates.idle, btnStates.stop].includes(btnState) ? btnStates.play : btnStates.pause,
      );
    }
  };

  const handleDelete = (e: any) => {
    const clickCallback = props.hasOwnProperty('delete') ? props.delete : null;
    if (typeof clickCallback === 'function') {
      clickCallback(e);
    }
  };

  const handleEdit = () => {
    const clickCallback = props.hasOwnProperty('edit') ? props.edit : null;
    if (typeof clickCallback === 'function') {
      clickCallback(props.task);
    }
  };

  const handleStop = () => {
    if (localStorage.getItem(`task_${props.task.id}`)) {
      setBtnState(btnStates.stop);
      const clickCallback = props.hasOwnProperty('btnState') ? props.btnState : null;
      if (typeof clickCallback === 'function') {
        clickCallback(btnStates.stop);
      }
    } else alert(`This task does not have any running tracking`);
  };

  const ButtonGroup = () => {
    return (
      <>
        <Tooltip title={'Pause/Start Tracking'}>
          <IconButton aria-label="play/pause" onClick={handleStartPause}>
            {[btnStates.pause, btnStates.idle, btnStates.stop].includes(btnState) ? (
              <PlayArrowIcon className={classes.icon} />
            ) : (
              <Pause className={classes.icon} />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title={'Stop'}>
          <IconButton aria-label="stop" onClick={handleStop}>
            <StopRounded className={classes.icon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Edit Task'}>
          <IconButton aria-label="edit" onClick={handleEdit}>
            <Settings className={classes.icon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Remove Task'}>
          <IconButton aria-label="delete" onClick={handleDelete}>
            <Delete className={classes.icon} />
          </IconButton>
        </Tooltip>
      </>
    );
  };

  const Content = () => {
    return (
      <CardContent>
        <Typography component="h5" variant="h5">
          {props.task.name || 'Default Name'}
        </Typography>
        <Typography variant="subtitle1">{props.task.description}</Typography>
        {props.task.labels
          ? props.task.labels.map((label: any, index: number) => {
              return (
                <Chip
                  className={classes.margin}
                  key={index}
                  style={{ backgroundColor: '#caffbf' }}
                  size="small"
                  label={label.name}
                />
              );
            })
          : null}
      </CardContent>
    );
  };

  return btnState === btnStates.play ? (
    <div className={classes.overlay}>
      <Card className={btnState === btnStates.play ? `${classes.root_active} ` : `${classes.root}`}>
        <Link className={`${classes.content} ${classes.link}`} to={`/task/${props.task.id}`}>
          <Content />
        </Link>
        <div className={classes.controls}>
          <ButtonGroup />
        </div>
      </Card>
    </div>
  ) : (
    <Card className={btnState === btnStates.play ? `${classes.root_active} ` : `${classes.root}`}>
      <Link className={`${classes.content} ${classes.link}`} to={`/task/${props.task.id}`}>
        <Content />
      </Link>
      <div className={classes.controls}>
        <ButtonGroup />
      </div>
    </Card>
  );
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      background: 'linear-gradient(45deg, #FE6B8B 20%, #FF8E53 90%)',
      color: 'white',
      flexWrap: 'wrap',
      marginTop: '3vh',
      padding: '5px',
      marginBottom: '20px',
      '&:hover': {
        cursor: 'pointer',
        background: 'linear-gradient(45deg, #FE6B8B 1%, #FF8E53 100%)',
        boxShadow: '0 4px 6px 3px rgba(255, 105, 135, .6)',
      },
    },
    root_active: {
      display: 'flex',
      boxShadow: '0 3px 5px 2px rgba(100, 105, 135, .3)',
      background: 'linear-gradient(45deg, #00b4d8 20%, #90e0ef 90%)',
      color: 'white',
      flexWrap: 'wrap',
      marginTop: 'auto',
      padding: '5px',
      marginBottom: 'auto',
      width: '65vw',
      '&:hover': {
        cursor: 'pointer',
        background: 'linear-gradient(45deg, #00b4d8 1%, #90e0ef 100%)',
        boxShadow: '0 4px 6px 3px rgba(100, 105, 135, .6)',
      },
    },
    margin: {
      margin: theme.spacing(0.2),
    },
    details: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    link: {
      textDecoration: 'none',
    },
    content: {
      color: 'white',
      flex: '1 0 auto',
    },
    cover: {
      width: 151,
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      justifyContent: 'flex-end',
    },
    icon: {
      height: 38,
      width: 38,
      color: 'white',
    },
    overlay: {
      zIndex: 100,
      background: 'rgba(0,0,0,0.3)',
      position: 'fixed',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
      justifyContent: 'center',
      display: 'flex',
    },
  }),
);

export default ControlCard;
