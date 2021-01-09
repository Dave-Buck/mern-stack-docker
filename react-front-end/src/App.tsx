import * as React from 'react';
import logo from './logo.svg';
import './App.css';
import { IAppState } from './IAppState';

export default class App extends React.Component<{}, IAppState> {
  constructor(props: any) {
    super(props);

    this.state = { 
      items: [], 
    };
  }  

  public render() {
 
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <form onSubmit={(e) => { this.handleSubmit(e) }}>
            <label>
              Name:
            </label>
            <input type="text" name="name" />
            <input type="submit" value="Submit" />
          </form>
          {this.state.items.map((item, idx) => {
            return (<div key={item._id}>
                      {item.name}
                      <span onClick={() => this.deleteItem(item._id)} style={{ color: 'red' }}>    &#10005;</span>
                      <span onClick={() => this.editItem(item._id)}>     &#9998;</span>
                    </div>)
          })}
        </header>
      </div>
    )
  }

  public async componentDidMount() {
    this.getItems();
  }

  public async handleSubmit(e: any) {
    e.preventDefault();

    await fetch('http://localhost:5000/item/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // We convert the React state to JSON and send it as the POST body
      body: JSON.stringify({ name: e.target.name.value })
    })
    .catch(() => console.error('Error submitting'));

    this.getItems();

  }

  public async getItems() {
    await fetch('http://localhost:5000/')
    .then(response => response.json())
    .then(items => this.setState({items: items.items}));
  }

  public async deleteItem(id: string) {

    await fetch('http://localhost:5000/item/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // We convert the React state to JSON and send it as the POST body
      body: JSON.stringify({ _id: id })
    })
    .catch(() => console.error('Error submitting'));

    this.getItems();
  }

  public async editItem(id: string) {
    let newName = window.prompt('Enter the new name:');

    await fetch('http://localhost:5000/item/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // We convert the React state to JSON and send it as the POST body
      body: JSON.stringify({ _id: id, newName: newName })
    })
    .catch(() => console.error('Error submitting'));

    this.getItems();

  }
}




