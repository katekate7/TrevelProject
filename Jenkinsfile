pipeline {
    agent any

    stages {
        stage('Build Frontend') {
            steps {
                dir('travel-frontend') {
                    sh 'docker build -t travel_frontend .'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('travel-backend') {
                    sh 'docker build -t travel_backend .'
                }
            }
        }
    }
}
