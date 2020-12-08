import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { Settings } from '@material-ui/icons';
import axios from 'axios';
import { Typography, createStyles, makeStyles, Button } from '@material-ui/core';
import TaskDetails from './components/TaskDetails';
import EditTaskModal from '../../components/EditTaskModal';

export interface Task {
  createdAt: string;
  description: string;
  id: string;
  name: string;
  labels: any[];
  trackings: any[];
  updatedAt: string;
}

const Task = ({ match }: any) => {
  const classes = useStyles();
  const [task, setTask] = useState<Task | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [match.params.id]);

  const fetchTask = async () => {
    await axios
      .get(`/task/${match.params.id}`)
      .then((res) => {
        if (res.status === 200) {
          setTask(res.data.data);
        }
      })
      .catch((e) => alert('Error code:' + e.response.status));
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    fetchTask();
    setIsOpen(false);
  };
  const handleEdit = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Layout>
      <div className={classes.head}>
        <Typography variant={'h4'} className={classes.title}>
          {task !== null ? task.name : 'Loading ...'}
          <Button
            className={classes.button}
            startIcon={<Settings />}
            variant="contained"
            size="small"
            title="Edit Task"
            onClick={handleEdit}
          >
            Edit Task
          </Button>
        </Typography>
        <Typography variant={'subtitle2'}>{task !== null ? task.description : ''}</Typography>
      </div>
      {task !== null ? <TaskDetails save={handleSave} task={task} /> : null}
      {isOpen ? <EditTaskModal task={task} cancel={handleCancel} save={handleSave} /> : null}
    </Layout>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    head: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      cursor: 'default',
    },
    button: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      height: 48,
      padding: '0 30px',
      float: 'right',
      '&:hover': {
        cursor: 'pointer',
        background: 'linear-gradient(45deg, #FE6B8B 1%, #FF8E53 100%)',
        boxShadow: '0 3px 5px 3px rgba(255, 105, 135, .6)',
      },
    },
  }),
);
export default Task;
