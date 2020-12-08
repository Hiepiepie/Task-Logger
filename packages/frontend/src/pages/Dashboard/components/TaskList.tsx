import React, { useEffect, useState } from 'react';
import ControlCard from './ControlCard';
import EditTaskModal from '../../../components/EditTaskModal';
import { Task } from '../../Task/Task';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import axios from 'axios';

const TaskList = (props: any) => {
  const [editActive, setEditActive] = useState(false);
  const [removeActive, setRemoveActive] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  useEffect(() => {
    setTasks(props.tasks);
  }, [props]);
  const handleStartPauseStop = (task: any, btnState: string) => {
    props.startPause(task, btnState);
  };
  const removeFromDB = async (t: any) => {
    await axios.delete(`/task/${task!.id}`, t).catch((e) => {
      alert(`Error code ${e.response.status} \n ${e.response.data.message}`);
    });
  };
  const handleRemove = () => {
    if (task) {
      tasks!.splice(
        tasks!.findIndex((t: Task) => t.id === task!.id),
        1,
      );
      removeFromDB(task);
      setRemoveActive(!removeActive);
    }
  };
  const popupRemove = (selectedTask: any) => {
    setTask(selectedTask);
    setRemoveActive(true);
  };
  const handleCancel = () => {
    setEditActive(false);
    setRemoveActive(false);
    setTask(null);
  };

  const handleSave = () => {
    props.save();
    setEditActive(!editActive);
  };
  const popupEdit = (task: any) => {
    setTask(task);
    setEditActive(!editActive);
  };
  if (tasks) {
    return (
      <div>
        {tasks.map((t: any, index: number) => {
          return (
            <ControlCard
              key={index}
              task={t}
              delete={() => popupRemove(t)}
              btnState={(prop: any) => handleStartPauseStop(t, prop)}
              edit={() => popupEdit(t)}
            />
          );
        })}
        {editActive ? <EditTaskModal save={handleSave} cancel={handleCancel} task={task} /> : null}
        {removeActive ? (
          <ConfirmationDialog okName={'remove'} ok={handleRemove} cancel={handleCancel} title={'Remove Task'}>
            Are you sure ?{' '}
          </ConfirmationDialog>
        ) : null}
      </div>
    );
  }
  return null;
};

export default TaskList;
