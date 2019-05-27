import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getGitHubRepos } from "../../actions/profile";
import Spinner from "../layout/Spinner";

const ProfileGithub = ({ username, repos, getGitHubRepos, loading }) => {
  useEffect(() => {
    getGitHubRepos(username);
  }, [getGitHubRepos, username]);
  return (
    <div class="profile-github">
      <h2 class="text-primary my-1">
        <i class="fab fa-github" /> Github Repos
      </h2>
      {repos === null ? (
        <Spinner />
      ) : (
        repos.map(repo => (
          <div key={repo._id} className="repo bg-white p-1 my-1">
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className="badge badge-primary">
                  Stars:{repo.stargazers_count}
                </li>
                <li className="badge badge-dark">
                  Watchers: {repo.watchers_count}
                </li>
                <li className="badge badge-light">Forks: {repo.forks_count}</li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGitHubRepos: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  repos: PropTypes.array.isRequired
};
const mapStateToProps = state => ({
  repos: state.profile.repos,
  username: state.profile.profile.githubusername,
  loading: state.profile.loading
});
export default connect(
  mapStateToProps,
  { getGitHubRepos }
)(ProfileGithub);
