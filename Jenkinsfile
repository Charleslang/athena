pipeline {
  agent any

  stages {
    stage('Pull') {
      steps {
        checkout scmGit(branches: [[name: '*/master']], extensions: [], userRemoteConfigs: [[credentialsId: 'dbe58879-a6f9-48c8-8c7a-77d750e358a5', url: 'https://gitee.com/djf1718/athena.git']])
      }
    }
    stage('Build') {
      steps {
        script {
          sh 'sh ./script/build.sh'
        }
      }
    }
  }

  post {
    success {
      script {
        def duration = "${currentBuild.durationString.replace(' and counting', '')}"
        env.BUILD_DURATION = duration
        sh 'export BUILD_RESULT=Success;export BUILD_NUM="${BUILD_DISPLAY_NAME}";export JOB_NAME="${JOB_BASE_NAME}";export BUILD_BRANCH="${GIT_BRANCH}";export BUILD_TIME="${BUILD_TIMESTAMP}";export BUILD_DURATION="${BUILD_DURATION}";export JOB_URL="${BUILD_URL}";export JOB_CONSOLE="${BUILD_URL}console";sh ./script/post-build.sh'
      }
    }
    failure {
      script {
        def duration = "${currentBuild.durationString.replace(' and counting', '')}"
        env.BUILD_DURATION = duration
        sh 'export BUILD_RESULT=Failed;export BUILD_NUM="${BUILD_DISPLAY_NAME}";export JOB_NAME="${JOB_BASE_NAME}";export BUILD_BRANCH="${GIT_BRANCH}";export BUILD_TIME="${BUILD_TIMESTAMP}";export BUILD_DURATION="${BUILD_DURATION}";export JOB_URL="${BUILD_URL}";export JOB_CONSOLE="${BUILD_URL}console";sh ./script/post-build.sh'
      }
    }
  }
}
