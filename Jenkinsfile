pipeline {
    agent any

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    environment {
        CI = 'true'
        HEADLESS = 'true'
        TAGS = '@e2e'
    }

    stages {
        stage('Install') {
            steps {
                sh 'node -v'
                sh 'npm ci'
            }
        }

        stage('E2E Tests') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh 'npm run test:e2e'
                }
            }
        }
    }

    post {
        always {
            script {
                if (fileExists('allure-results')) {
                    try {
                        allure([
                            includeProperties: true,
                            jdk: '',
                            properties: [],
                            reportBuildPolicy: 'ALWAYS',
                            results: [[path: 'allure-results']]
                        ])
                    } catch (ignored) {
                        echo 'Install the Jenkins Allure plugin to publish the HTML report from allure-results.'
                    }
                }
            }
            archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true, fingerprint: true
        }
    }
}
