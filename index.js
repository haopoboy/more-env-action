const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  outputDockerTag();
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

function outputDockerTag() {
  if (github.context.head_ref) {
    core.setOutput("docker-tags", `pr-${github.context.event.number}`);
    return;
  }
  
  const branch = github.context.ref.split('/').pop();
  if (['main', 'master'].includes(branch)) {
    core.setOutput("docker-tags", `lastest,${branch}`);
  } else {
    core.setOutput("docker-tags", branch);
  }
}
