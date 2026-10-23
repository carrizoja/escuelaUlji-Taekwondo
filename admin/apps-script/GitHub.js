/**
 * GitHub integration: trigger the site rebuild and read the last deploy.
 * The token is read from Script Properties and never included in messages.
 */

const DEPLOY_WORKFLOW_FILE = 'deploy.yml';
const REBUILD_EVENT_TYPE = 'content-updated';

function githubRequest(path, options) {
  const params = Object.assign({
    headers: {
      Authorization: 'Bearer ' + getConfig('GITHUB_TOKEN'),
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    muteHttpExceptions: true
  }, options);
  return UrlFetchApp.fetch('https://api.github.com/repos/' + getConfig('GITHUB_REPO') + path, params);
}

function githubError(action, response) {
  const code = response.getResponseCode();
  const hint = code === 401 || code === 403 || code === 404 ? ' Revisá el token y sus permisos.' : '';
  return new Error('GitHub respondió HTTP ' + code + ' al ' + action + '.' + hint);
}

/**
 * Sends the repository_dispatch that rebuilds and redeploys the site.
 * @throws {Error} When GitHub does not accept the request (no secrets in the message)
 */
function triggerRebuild() {
  const response = githubRequest('/dispatches', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ event_type: REBUILD_EVENT_TYPE })
  });
  if (response.getResponseCode() !== 204) throw githubError('pedir la publicación', response);
}

/**
 * Last run of the deploy workflow.
 * @returns {{status: string, conclusion: string, createdAt: string, htmlUrl: string}}
 *   status "none" when the workflow has never run
 */
function getDeployStatus() {
  const response = githubRequest('/actions/workflows/' + DEPLOY_WORKFLOW_FILE + '/runs?per_page=1');
  if (response.getResponseCode() !== 200) throw githubError('consultar el estado de la publicación', response);
  const run = (JSON.parse(response.getContentText()).workflow_runs || [])[0];
  if (!run) return { status: 'none', conclusion: '', createdAt: '', htmlUrl: '' };
  return {
    status: run.status || '',
    conclusion: run.conclusion || '',
    createdAt: run.created_at || '',
    htmlUrl: run.html_url || ''
  };
}
