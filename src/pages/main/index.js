import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Container from '../../components/Container/index'
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa'
import { List, Form, SubmitButton } from './style';

import api from '../../services/api';

export default class main extends Component {
  state = {
    newRP: '',
    repositories: [],
    loading: false
  }

  //carregar os dados do local storage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');
    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) })
    }
  }

  // salvar os dados do local storage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories))
    }

  }

  handleInputChange = e => {
    const { newRP } = this.state
    this.setState({ newRP: e.target.value });

  }

  handleSubmit = async e => {

    e.preventDefault();

    this.setState({ loading: true })

    const { newRP, repositories } = this.state;
    const response = await api.get(`/repos/${newRP}`)

    const data = {
      name: response.data.full_name,
    };
    this.setState({
      repositories: [...repositories, data],
      newRP: '',
      loading: false
    })

  }

  render() {

    const { newRP, loading, repositories } = this.state
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositories
      </h1>
        <Form onSubmit={this.handleSubmit}>

          <input type="text"
            placeholder="add repositories"
            value={newRP}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading} >
            {loading ? (<FaSpinner color="#FFF" size={14} />
            ) : (
                <FaPlus color="#FFF" size={14} />)}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`} >Details</Link>
            </li>
          ))}
        </List>

      </Container >

    );
  }
}
