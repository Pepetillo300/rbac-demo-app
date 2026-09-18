pipeline {
    agent any
    environment {
        DOCKERHUB_USER = 'pepetillo300'
        IMAGE_NAME     = "${DOCKERHUB_USER}/rbac-demo-app"
        IMAGE_TAG      = "${BUILD_NUMBER}"
        KUBECONFIG     = '/var/lib/jenkins/.kube/developer-config'
    }
    triggers {
        pollSCM('* * * * *')
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .'
            }
        }
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DHU', passwordVariable: 'DHP')]) {
                    sh '''
                        echo "$DHP" | docker login -u "$DHU" --password-stdin
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    sed "s|IMAGE_PLACEHOLDER|${IMAGE_NAME}:${IMAGE_TAG}|g" k8s/deployment.yaml > k8s/deployment.rendered.yaml
                    kubectl apply -f k8s/deployment.rendered.yaml -n production
                    kubectl apply -f k8s/service.yaml -n production
                    kubectl rollout status deployment/rbac-demo-app -n production --timeout=120s
                '''
            }
        }
    }
    post {
        success {
            echo "Deployed ${IMAGE_NAME}:${IMAGE_TAG} to the production namespace."
        }
    }
}
