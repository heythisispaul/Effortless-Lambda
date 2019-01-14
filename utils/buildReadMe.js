const buildReadMe = (project, description) => {
  return `# ${project}\n### ${description.length > 0 ? description : 'A serverless function.'}\n\n*This project was created using [Effortless Lambda](https://github.com/heythisispaul/Effortless-Lambda), a generator made with the intention of improving the development experience.*`
};

module.exports = buildReadMe;