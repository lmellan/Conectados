
pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    environment {
        BACKEND_DIR = 'backend-conectados'
        FRONTEND_DIR = 'frontend-conectados'
    }

    stages {
        stage('Filtrar ramas') {
            steps {
                script {
                    def branchName = env.GIT_BRANCH?.replaceFirst(/^origin\//, '')
                    echo "Rama detectada: ${branchName}"
                    if (!(branchName == 'main' || branchName == 'develop')) {
                        echo "Rama '${branchName}' no está autorizada para ejecutar el pipeline."
                        currentBuild.result = 'NOT_BUILT'
                        error("Abortando pipeline.")
                    }
                }
            }
        }

        stage('Clonar repositorio') {
            steps {
                checkout scm
            }
        }

        stage('Test y Build Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo "Ejecutando tests y construyendo backend..."
                    sh './mvnw clean verify' // incluye tests y empaquetado
                }
            }
        }

        stage('Test y Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    echo "Ejecutando tests de frontend..."
                    sh 'npm install'
                    sh 'npm test -- --watchAll=false' // ejecuta todos los tests una vez
                    echo "Construyendo frontend..."
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
        success {
            echo 'Build completado con éxito.'
            withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')]) {
                sh '''
                    curl -X POST -H 'Content-type: application/json' \
                    --data '{"text":"*Conectados*: Build exitoso."}' \
                    "$SLACK_URL"
                '''
            }
        }
        failure {
            echo 'Ocurrió un error durante el build.'
            withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')]) {
                sh '''
                    curl -X POST -H 'Content-type: application/json' \
                    --data '{"text":"*Conectados*: Build fallido."}' \
                    "$SLACK_URL"
                '''
            }
        }
    }
}
