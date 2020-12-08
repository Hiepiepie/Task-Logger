import React, { useEffect, useState } from 'react';
import TaskList from './components/TaskList';
import axios, { AxiosResponse } from 'axios';
import { Layout } from '../../components/Layout';
import { Add } from '@material-ui/icons';
import { FormControl, InputLabel, Select, MenuItem, createStyles, makeStyles, Theme, Button } from '@material-ui/core';
import BootstrapInput from '../../components/BootstrapInput';
import NewTask from './components/NewTask';
import { Task } from '../Task/Task';
import Tracking from './components/Tracking';

const Toolbar = ({ classes, filterText, handleChange, filter, handleSelect, handleNewTask }: any) => {
  return (
    <div className={classes.head}>
      <h2 className={classes.title}>Tasks</h2>
      <FormControl className={classes.margin}>
        <InputLabel htmlFor="textbox">Filter</InputLabel>
        <BootstrapInput id="textbox" value={filterText} onChange={handleChange} />
      </FormControl>
      <FormControl className={classes.margin}>
        <InputLabel id="customized-select">Filter</InputLabel>
        <Select
          labelId="customized-select"
          id="demo-customized-select"
          value={filter}
          onChange={handleSelect}
          input={<BootstrapInput />}
        >
          <MenuItem value={'label'}>Label</MenuItem>
          <MenuItem value={'name'}>Name</MenuItem>
          <MenuItem value={'description'}>Description</MenuItem>
        </Select>
      </FormControl>
      <Button
        className={classes.button}
        startIcon={<Add />}
        variant="contained"
        size="small"
        title="New Task"
        onClick={handleNewTask}
      >
        New Task
      </Button>
    </div>
  );
};

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[] | null>([]);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  const [filterText, setFilterText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [tracking, setTracking] = useState({ task: null, btnState: 'idle' });
  const classes = useStyles();

  const fetchTasks = async () => {
    await axios
      .get('/task', {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          setTasks(response.data.data);
          setData(response.data.data);
        }
      })
      .catch((e) => {
        alert(e.response.data.message);
      });
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSelect = (event: any) => {
    setFilter(event.target.value as string);
    setTasks(data);
    setFilterText('');
  };
  const searchTask = (text: string) => {
    return (task: any) => {
      switch (filter) {
        case 'name':
          if (task.name.toLowerCase().includes(text.toLowerCase())) {
            return task;
          }
          break;

        case 'label': {
          const match = task.labels.map((label: any) => {
            return label.name.toLowerCase().includes(text.toLowerCase());
          });
          if (match.includes(true)) return task;
          break;
        }
        case 'description':
          if (task.description.toLowerCase().includes(text.toLowerCase()) && task.description !== null) {
            return task;
          }
          break;

        default:
          console.log(`type ${filter} not found`);
          break;
      }
    };
  };
  const handleSave = async () => {
    setIsOpen(false);
    await fetchTasks().then(() => {
      fetchTasks();
    });
  };
  const handleChange = (e: any) => {
    setFilterText(e.target.value as string);
    const text = e.target.value;
    if (filter !== '') {
      let dummy: any = [...data];
      dummy = dummy.filter(searchTask(text));
      setTasks(dummy);
    }
  };
  const handleStop = (taskProp: any, btnState: string) => {
    setTracking({
      task: taskProp,
      btnState,
    });
  };
  const toggleNewTaskDialog = () => {
    setIsOpen(!isOpen);
  };
  const handleStartPause = (taskProp: any, btnState: string) => {
    setTracking({
      task: taskProp,
      btnState,
    });
  };
  return (
    <Layout>
      <Toolbar
        classes={classes}
        filterText={filterText}
        handleChange={handleChange}
        filter={filter}
        handleSelect={handleSelect}
        handleNewTask={toggleNewTaskDialog}
      />
      <TaskList save={handleSave} stop={handleStop} startPause={handleStartPause} tasks={tasks} />
      {isOpen ? <NewTask save={handleSave} open={toggleNewTaskDialog} /> : null}
      <Tracking task={tracking.task} btnState={tracking.btnState} />
    </Layout>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    head: {
      display: 'flex',
    },
    title: {
      cursor: 'default',
      marginTop: theme.spacing(4),
    },
    margin: {
      margin: theme.spacing(1),
    },
    button: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      height: 48,
      padding: '0 30px',
      marginLeft: 'auto',
      marginTop: theme.spacing(3),
      '&:hover': {
        cursor: 'pointer',
        background: 'linear-gradient(45deg, #FE6B8B 1%, #FF8E53 100%)',
        boxShadow: '0 3px 5px 3px rgba(255, 105, 135, .6)',
      },
    },
  }),
);

export default Dashboard;
