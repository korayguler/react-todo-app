import Axios from 'axios';
import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const url = 'http://localhost:3000/todos';

  useEffect(() => {
    get(url);
  }, []);

  function add(e) {
    e.preventDefault();
    let todo = e.target.todo;
    const level = e.target.level;
    if (todo.value === '' || level.value === '') return;
    post(url, {
      id: todos.length + 1,
      todo: todo.value,
      level: level.value,
      check: false,
    }).then((data) => console.log(data));
    todo.value = '';
    get();
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
    get();
    return response.json();
  }

  async function get(URL = url) {
    const response = await Axios.get(url);
    setTodos(response.data);
  }

  async function del(e) {
    const id = e.target.value;

    if (id === '') return;
    
    if(window.confirm("Silmek üzeresiniz... Silmek için emin misiniz ?")){
      fetch(url + '/' + id, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      get();
    }
  }

  async function checkControl(e) {
    const id = e.target.dataset.id;
    const URL = url + '/' + id;
    console.log(e);
    if (id === '' && id === null) return;

    let curr = !todos.find((d) => (d.id === parseInt(id) ? d.check : null));
    const response = await Axios.patch(
      URL,
      {
        check: curr,
      },
      { headers: { 'Content-Type': 'application/json' } },
    );
    const result = response.data;
    console.log(result);
    get();
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
                className='button-primary u-pull-right'
                type='submit'
              ></input>
            </div>
          </form>
        </div>
      </div>

      <table className='u-full-width todos'>
        <thead>
          <tr>
            <th>Todo</th>
            <th>
              <span className='u-pull-right'>Check</span>
            </th>
            <th>
              <span className='u-pull-right'>Delete</span>
            </th>
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
                    <button
                      className='check u-pull-right'
                      data-id={data.id}
                      onClick={checkControl}
                    >
                      <i
                        className={
                          data.check
                            ? 'fas fa-check-circle fa-lg'
                            : 'far fa-check-circle fa-lg'
                        }
                      ></i>
                    </button>
                  </td>
                  <td>
                    <button
                      className='button-primary u-pull-right'
                      onClick={del}
                      value={data.id}
                    >
                      <i className='fa fa-times fa-lg'></i>
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
