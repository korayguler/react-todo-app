import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [update, setUpdate] = useState(true);
  const url = 'http://localhost:3000/todos';

  useEffect(() => {
    get(url).then((data) => setTodos(data));
    setUpdate(false);
  }, [update]);
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
    setUpdate(true);
  }

  async function post(url = '', data = '') {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    setUpdate(true);
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
    setUpdate(true);
  }

  async function clearAll() {
    if (todos === '') return;
    todos.forEach((e) => {
      fetch(url + '/' + e.id, {
        method: 'DELETE',
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    });
    setUpdate(true);
  }

  async function checkControl(e) {
    const id = e.target.value;
    if (id === '') return;
    const curr = await !todos.find((d) => d.id === parseInt(id)).check;
    console.log(curr);
    const response = await fetch(url + '/' + id, {
      method: 'PATCH',
      header: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        check: curr,
      }),
    });

    const result = response.json();

    result.then((json) => console.log(json)).catch((err) => console.error(err));
    setUpdate(true);
  }
  return (
    <div className='container'>
      <h4>React Todo App</h4>
      <div className='row'>
        <div className='five column'>
          <form onSubmit={add}>
            <label htmlFor='todo'>your todo</label>
            <input
              className='u-full-width'
              placeholder='todo …'
              id='todo'
              type='text'
              style={{ resize: 'none' }}
            />
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
                  <td className={data.check ? 'checked' : null}>{data.todo}</td>
                  <td>
                    <input
                      type='checkbox'
                      defaultChecked={data.check}
                      value={data.id}
                      onChange={checkControl}
                    />

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
