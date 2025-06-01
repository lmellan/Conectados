pipeline {
    agent any

    environment {
        BACKEND_DIR = 'backend-conectados'
        FRONTEND_DIR = 'frontend-conectados'
    }

    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/ConectadosTeam/Conectados.git'
            }
        }

        stage('Construir Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('Construir Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                    sh 'CI="" npm run build'
                }
            }
        }

        // stage('Desplegar') {
        //     steps {
        //         echo 'Aquí puedes copiar archivos o reiniciar servicios en tu servidor'
        //     }
        // }
    }

    post {
        success {
            echo 'Build completado con éxito.'
            withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')]) {
                sh '''
                    curl -X POST -H 'Content-type: application/json' \
                    --data '{"text":" Build exitoso del proyecto Conectados."}' \
                    "$SLACK_URL"
                '''
            }
        }

        failure {
            echo 'Ocurrió un error durante el build.'
            withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')]) {
                sh '''
                    curl -X POST -H 'Content-type: application/json' \
                    --data '{"text":" Build fallido en Jenkins (Conectados)."}' \
                    "$SLACK_URL"
                '''
            }
        }
    }
}
