const keywords = ["HTML", "CSS", "Sass", "Less", "Web Components", "React", "Angular", "Vue.js", "Ember.js", "Backbone.js", "Polymer", "Svelte", "Meteor", "Preact", "Aurelia", "Knockout.js", "Riot.js", "Mithril", "Stimulus", "Vanilla JS (plain JavaScript)",
"React", "Angular", "Vue.js", "Ember.js", "Backbone.js", "Polymer", "Svelte", "Aurelia", "Knockout.js", "Riot.js", "Mithril", "Stimulus",
"Bootstrap", "Tailwind CSS", "Material UI",
"Webpack", "Gulp", "Grunt", "Gradle", "Maven", "Ant",
"Node.js", "Ruby on Rails", "Django", "Flask", "Express.js", "Spring Boot", "ASP.NET", "Laravel", "Phoenix", "Go", "CodeIgniter", "CakePHP", "Symfony",
"MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "Oracle", "SQL Server", "Couchbase", "Memcached", "Elasticsearch", "Apache Solr", "Amazon DynamoDB",
"Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud Platform (GCP)", "Heroku", "DigitalOcean", "IBM Cloud", "OpenStack",
"Docker", "Kubernetes", "AWS ECS", "Google Kubernetes Engine (GKE)", "Istio",
"Ansible", "Chef", "Puppet", "SaltStack", "Terraform", "AWS CloudFormation", "Azure Resource Manager", "Google Cloud Deployment Manager", "HashiCorp Consul", "HashiCorp Vault", "etcd", "ZooKeeper", "CFEngine", "Rudder", "Foreman", "Stacki", "Juju", "Octopus Deploy", "Otter", "Fabric", "SmartFrog", "Bcfg2", "Opsi", "ConfigServer", "CFNCluster", "Red Hat Satellite", "Spacewalk",
"Jenkins", "GitLab CI/CD", "Travis CI", "CircleCI", "Bamboo", "GitHub Actions", "Azure DevOps", "CodeShip", "Concourse", "Drone", "GoCD", "TeamCity", "AWS CodePipeline", "Bitbucket Pipelines", "Buddy", "Buildkite", "Semaphore", "Wercker", "CruiseControl", "FinalBuilder", "GitVersion", "GitFlow", "AWS CodeDeploy", "Octopus Deploy", "Capistrano", "DeployBot", "ElectricFlow", "Spinnaker", "XL Release",
"JUnit", "Selenium", "Cucumber", "NUnit", "pytest",
"SonarQube", "CodeClimate", "Coverity", "Fortify",
"GraphQL", "RESTful APIs", "WebSockets", "OAuth", "JWT", "JSON", "XML", "RabbitMQ", "Kafka", "Postman", "Swagger",
"Git", "GitHub", "Bitbucket", "GitLab", "Subversion",
"Jira", "Trello", "Asana", "Slack", "Microsoft Teams",
"Prometheus", "Grafana", "Elasticsearch", "Log"];

export const matchKeywords = (str:string[]):string[] => keywords.filter(keyword => str.includes(keyword));
export const uniqueKeywords = (arr:string[]):string[] => arr.filter((value,index,array)=>array.indexOf(value) === index);