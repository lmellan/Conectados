pipeline {
    agent any

    environment {
        BACKEND_DIR = 'backend-conectados'
        FRONTEND_DIR = 'frontend-conectados'
        DOCKER_COMPOSE_DIR = 'docker' 
    }

    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/ConectadosTeam/Conectados.git'
            }
        }
        stage('Levantar MySQL') {
            steps {
                dir("${DOCKER_COMPOSE_DIR}") {
                    sh 'docker-compose up -d'
                }

                sh '''
                    echo "Esperando a que MySQL esté disponible..."
                    for i in {1..20}; do
                      nc -z localhost 3306 && echo "MySQL está listo" && exit 0
                      echo "Esperando..."
                      sleep 3
                    done
                    echo "MySQL no está disponible"
                    exit 1
                '''
            }
        }

        stage('Test y Build Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh './mvnw clean verify'
                }
            }
        }

        stage('Test y Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                    sh 'npm test -- --watchAll=false'
                    sh 'CI="" npm run build'
                }
            }
        }

        stage('Guardar artefacto') {
            steps {
                archiveArtifacts artifacts: "${BACKEND_DIR}/target/*.jar", fingerprint: true
            }
        }
    }

    post {
        always {
            echo "Deteniendo contenedores..."
            dir("${DOCKER_COMPOSE_DIR}") {
                sh 'docker-compose down'
            }

            echo "Build finalizado con estado: ${currentBuild.currentResult}"

            withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')]) {
                sh '''
                    curl -X POST -H 'Content-type: application/json' \
                    --data '{"text":"*Conectados*: Resultado del build: ''' + "${currentBuild.currentResult}" + '''"}' \
                    "$SLACK_URL"
                '''
            }
        }
    }
}
