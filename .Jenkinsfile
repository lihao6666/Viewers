pipeline {
  agent any
  tools {
    nodejs 'node'
  }
  environment {
    CI_REGISTRY='harbor.cloud-ustcfq.com'
    CI_REGISTRY_PROJECT='ohif'
    CI_REGISTRY_USER='ohif-user'
    CI_REGISTRY_PASSWORD='Harbor@ohif7355608'

    CI_OHIF_IMAGE='ohif-v3'
    CI_OHIF_TAG='3.7.0'


  }
  stages {

    stage('克隆前端仓库代码') {
      steps {
        git(url: 'https://bmec.ustc.edu.cn/git/Mars456/ohif-v3.git', credentialsId: 'bmec-gitlab-2', branch: 'master', changelog: true, poll: false)
      }
    }
    stage('安装前端代码依赖和打包') {
      steps {
        sh 'yarn config set registry https://registry.npm.taobao.org'
        sh 'yarn install'
        sh 'yarn run build'
        echo 'install deps and build ok'
      }
    }

    stage('构建前端镜像并推送') {
      steps {
        sh 'cd ./platform/app'
        echo 'save dist artifacts'
        sh 'tar -zcvf dist.tar.gz dist/'
        archiveArtifacts(artifacts: 'dist.tar.gz', fingerprint: true)
        echo 'build docker image'
        sh 'docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY'
        sh 'docker build -t $CI_REGISTRY/$CI_REGISTRY_PROJECT/$CI_OHIF_IMAGE:$CI_OHIF_TAG .'
        sh 'docker push $CI_REGISTRY/$CI_REGISTRY_PROJECT/$CI_OHIF_IMAGE:$CI_OHIF_TAG'
        }
      }
  }
}
