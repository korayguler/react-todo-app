import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const url = 'http://localhost:3000/todos';

  useEffect(() => {
    get(url).then((data) => setTodos(data));
  });
  function add(e) {
    e.preventDefault();
    const todo = e.target.todo;
    const level = e.target.level;
    if (todo.value === '' || level.value === '') return;

    post(url, {
      id: todos.length + 1,
      todo: todo.value,
      level: level.value,
      check: false,
    }).then((data) => console.log(data));
  }

  async function post(url = '', data = '') {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async function get(url = '') {
    const response = await fetch(url);
    return response.json();
  }

  async function del(e) {
    const id = e.target.value;

    if (id === '') return;

    fetch(url + '/' + id, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log(e.target.value);
  }

  async function clearAll() {
    if (todos === '') return;
    todos.map((e) => {
      fetch(url + '/' + e.id, {
        method: 'DELETE',
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    });
  }

  return (
    <div className='container'>
      <h4>React Todo App</h4>
      <div className='row'>
        <div className='five column'>
          <form onSubmit={add}>
            <label htmlFor='todo'>your todo</label>
            <textarea
              className='u-full-width'
              placeholder='todo …'
              id='todo'
              style={{ resize: 'none' }}
            ></textarea>

            <div className='row'>
              <select className='three columns ' id='level'>
                <option value='normal'>Normal</option>
                <option value='important'>Önemli</option>
                <option value='less-important'>Az önemli</option>
              </select>
              <input
                className='three columns button-primary u-pull-right'
                type='submit'
              ></input>
              <button className='button u-pull-right' onClick={clearAll}>
                Clear All
              </button>
            </div>
          </form>
        </div>
      </div>

      <table className='u-full-width todos'>
        <thead>
          <tr>
            <th>Todo</th>
            <th>Check</th>
          </tr>
        </thead>
        <tbody>
          {todos
            .slice(0)
            .reverse()
            .map((data) => {
              return (
                <tr key={data.id} className={data.level}>
                  <td>{data.todo}</td>
                  <td>
                    <input type='checkbox' defaultChecked={data.check} />

                    <button
                      className='button-primary u-pull-right'
                      onClick={del}
                      value={data.id}
                    >
                      <i className='fa fa-times'></i>
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
