import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import PropTypes from 'prop-types';
import { Loading, Owner, IssueList } from './styles';
import Container from '../../components/Container/index';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({ //para definir propriedade tipo objeto usar shape
      params: PropTypes.shape({
        repository: PropTypes.string,
      })
    }).isRequired
  }

  state = {
    repository: {}, // como é apenas 1 repositorio inicia-se como array
    issues: [],
    loading: true,
  }

  async componentDidMount() {
    const { match } = this.props

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        }
      })
    ])  // fazendo uma requisição assyncrona que carrega dois elementos de uma vez
    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false
    })

  }
  render() {
    const { repository, issues, loading } = this.state;

    if (loading) {
      return <Loading> Carregando </Loading>
    }
    return (
      <Container>
        <Owner>
          <Link to="/"> voltar aos repositorios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>

        </Owner>
        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    )
  }

}
