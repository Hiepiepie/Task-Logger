import React, { useEffect, useState } from 'react';
import './InputTag.css';
import { TextField } from '@material-ui/core';

const InputTag = (props: any) => {
  const [tags, setTags] = useState<any>([]);
  const [text, setText] = useState('');
  useEffect(() => {
    props.tags ? setTags(props.tags) : setTags([]);
  }, [props.tags]);
  const removeTag = (i: any) => {
    const newTags = [...tags];
    newTags.splice(i, 1);
    setTags(newTags);
    props.handleChange([...newTags]);
  };

  const inputKeyDown = (e: any) => {
    const val = e.target.value;
    if (e.key === 'Enter' && val) {
      if (tags.find((tag: string) => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      setTags([...tags, val]);
      setText('');
      props.handleChange([...tags, val]);
    } else if (e.key === 'Backspace' && !val) {
      removeTag(tags.length - 1);
    }
  };
  const handleChange = (e: any) => {
    setText(e.target.value);
  };
  return (
    <div className="input-tag">
      <ul className="input-tag__tags">
        {tags.map((tag: any, i: any) => (
          <li key={tag}>
            {tag}
            <button
              type="button"
              onClick={() => {
                removeTag(i);
              }}
            >
              +
            </button>
          </li>
        ))}
      </ul>
      <TextField
        style={{ width: '100%' }}
        label="Label"
        value={text}
        onChange={handleChange}
        onKeyDown={inputKeyDown}
      />
    </div>
  );
};
export default InputTag;
