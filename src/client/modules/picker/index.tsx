import React from 'react';

import BasePicker from './BasePicker';
const list1 = [];
for (let i = 0; i < 24; i++) {
  list1.push({ label: `${i < 10 ? `0${i}` : i}:00`, value: i });
}

const data = [list1, list1];

export default class Example extends React.Component {
  render() {
    return (
      <div>
        <BasePicker
          data={data}
          defaultSelected={[5]}
          onChange={(value) => console.log('base', value)}
        />
      </div>
    );
  }
}
