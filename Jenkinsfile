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

        stage('Build Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh './mvnw clean install -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                    sh 'CI="" npm run build'
                }
            }
        }

        stage('Levantar Frontend y Backend') {
            steps {
                script {
                    // Backend en segundo plano
                    dir("${BACKEND_DIR}") {
                        sh 'nohup ./mvnw spring-boot:run -DskipTests &'
                    }

                    // Frontend en segundo plano
                    dir("${FRONTEND_DIR}") {
                        sh 'nohup npm run dev &'
                    }

                    // Esperar que estén disponibles
                    sh '''
                        echo "Esperando backend (8080)..."
                        for i in {1..20}; do
                          respuesta=$(curl -s http://localhost:8080/api/public/ping)
                          if [ "$respuesta" = "pong" ]; then
                            echo "Backend está listo"
                            break
                          fi
                          echo "Esperando backend..."
                          sleep 3
                        done

                        echo "Esperando frontend (3000)..."
                        for i in {1..20}; do
                          codigo=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
                          if [ "$codigo" = "200" ]; then
                            echo "Frontend está listo"
                            break
                          fi
                          echo "Esperando frontend..."
                          sleep 3
                        done
                    '''
                }
            }
        }

        stage('Test UI Selenium') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh './mvnw test -Dtest=*UITest'
                }
            }
        }

        stage('Test Unitarios Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh './mvnw test -Dtest=!*UITest'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm test -- --watchAll=false'
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
            echo "Deteniendo contenedores y procesos..."

            dir("${DOCKER_COMPOSE_DIR}") {
                sh 'docker-compose down'
            }

            sh 'pkill -f "mvnw spring-boot:run" || true'
            sh 'pkill -f "npm run dev" || true'

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
