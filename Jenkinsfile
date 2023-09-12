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
    HTTP_PROXY='http://10.0.1.38:7890'
    HTTPS_PROXY='http://10.0.1.38:7890'


  }
  stages {

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
        dir('platform/app') {
        echo 'save dist artifacts'
        sh 'ls'
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

  post {
    failure {
        slackSend (color: 'warning', message: "ohif-v3镜像构建失败，版本号：$CI_OHIF_TAG")
    }
    success {
        slackSend (color: 'good', message: "ohif-v3镜像构建成功，版本号：$CI_OHIF_TAG")
    }
  }
}
