import React from 'react';

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = { cards: [], value: '' };
  }

  componentDidMount() {
    this.getCardsList();
  }

  getCardsList() {
    const getList = () => {
      fetch('http://localhost:7777/notes', {
        method: 'GET'
      }).then((response) => response.json())
        .then((json) => this.setState(prev => ({ ...prev, cards: json })))
        .then(() => console.log('Запросили список карточек на сервере'));
    }
    getList();
  }



  handleChange(event) {
    this.setState(prev => ({ ...prev, value: event.target.value }));
  }

  addCard() {
    fetch('http://localhost:7777/notes', {
      method: 'POST',
      body: JSON.stringify({ "id": 0, "content": this.state.value }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => console.log('Отправили новую карточку на сервер'))
      .then(() => this.getCardsList())
      .then(() => this.setState(prev => ({ ...prev, value: '' })));
  }

  deleteCard(id) {
    fetch(`http://localhost:7777/notes/${id}`, {
      method: 'DELETE',
    }).then(() => console.log('Удалили карточку'))
      .then(() => this.getCardsList())
  }

  render() {
    return (
      <div className="container">
        <div className="workspace-container">
          <div className="header-container">
            <h1>Notes</h1>
            <div className="refresh-btn-container">
              <button type="button" className="btn btn-info" onClick={() => this.getCardsList()}>Refresh</button>
            </div>
          </div>
          <div className="newcard-field-container">
            <div className="mb-3">
              <label htmlFor="exampleFormControlTextarea1" className="form-label">New note</label>
              <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" value={this.state.value} onChange={(event) => this.handleChange(event)}></textarea>
              <button type="button" className="btn btn-success" onClick={(event) => this.addCard(event)}>Add</button>
            </div>
          </div>
        </div>
        <div className="board-container">
          <div className="card-list">
            {
              this.state.cards.map(card => 
                <div className="card" key={card.id}>
                  <div className="card-body">
                    <p className="card-text">{card.content}</p>
                    <button type="button" className="btn btn-danger" onClick={() => this.deleteCard(card.id)}>Delete</button>
                  </div>
                </div>
              )
            }
          </div>

        </div>
      </div>
    )
  }
}
