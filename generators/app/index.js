var generator = require('yeoman-generator'),
    fs = require('fs'),
    path = require('path'),
    chalk = require('chalk')

var config = {
    github:{
        username:'liuyanli',
        repository:'scaffold',
        branch:'master'
    },
    app:{
        name:'scaffold-demo',
        user:'liuyanli'
	},
	targetPath:''
}
var log = function(msg){
    console.log(chalk.green(msg))
}

module.exports = generator.Base.extend({
    constructor(){
        generator.Base.apply(this,arguments)

        
        this.app = config.app
        //add custom code
        this.option("update", {
            desc: "Update scaffold",
            type: Boolean,
            defaults: false
        })
		this.option("archive", {
            desc: "The archive url",
            type: String,
            defaults: ""
		})
		this.option("username", {
            desc: "The git username",
            type: String,
            defaults: config.github.username
        })

        this.option("repository", {
            desc: "The git repository name",
            type: String,
            defaults: config.github.repository
        })

        this.option("branch", {
            desc: "The git branch name",
            type: String,
            defaults: config.github.branch
		})
		this.option("skip-local-cache", {
            desc: "Skips the local cache",
            type: Boolean,
            defaults: true
        })

        this.option("skip-npm-install", {
            desc: "Skips the installation of npm",
            type: Boolean,
            defaults: false
        })

        this.option("skip-bower-install", {
            desc: "Skips the installation of bower",
            type: Boolean,
            defaults: false
        })

    },
    // 初始化
    initializing() {
        log("Welcome to use scaffold.")
    },
    // 调用this.prompt()与用户产生交互
    prompting(){
        return this.prompt([{
            type:'input',
            name: 'appName',
            message: '请输入项目名字',
            default: config.app.name
        },
        {
            type:'input',
            name: 'userName',
            message: '请输入创建者名字',
            default: this.config.app.user
        }]).then((answers)=>{
            this.log('create project: ', answers.appName);
            this.log('by: ', answers.userName);
            this.app = answers;
        })
	},
	//创建项目文件
	writing(){
		var self = this,
			done = this.async(),
			archive = this.options["archive"],
            skipLocalCache = this.options["skip-local-cache"],
            username = this.options["username"],
            repository = this.options["repository"],
            branch = this.options["branch"],
			target = path.join(config.targetPath, config.app.name)
			
		function callback(err, remote){
			var source
			if (!err) {
				log("The branch has been download to " + remote.cachePath)

				log("Copy files to " + path.join(process.cwd(), target))

				//copy assets and .* file
				source = [path.join(remote.cachePath, "**"), path.join(remote.cachePath, ".*")]

				fs.copy(source, target)

			} else {
				log(err)
				process.exit(1)
			}

			done();
		}
		log("Downloading the files.");

        //if archive is not empty
        if(archive){
            this.remote(archive, callback, skipLocalCache);
        }else{
            this.remote(username, repository, branch, callback, skipLocalCache);
		}
		
	},
	//调用(npm, bower)包install
	install(){
		var update = this.options["update"],
		skipNpmInstall = this.options["skip-npm-install"],
		skipBowerInstall = this.options["skip-bower-install"]

		!update && this.installDependencies({
			bower: skipBowerInstall ? false : true,
			npm: skipNpmInstall ? false : true,
			callback: function(err) {
				log("The installation of dependencies has been download.");
			}
		})
	},
	end() {
		log.info('generator success');
	}
})