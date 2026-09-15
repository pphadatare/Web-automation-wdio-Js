def loadNode = '''
set -e
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
    nvm use 20
elif [ -x /opt/homebrew/bin/node ]; then
    export PATH="/opt/homebrew/bin:$PATH"
elif [ -x /usr/local/bin/node ]; then
    export PATH="/usr/local/bin:$PATH"
fi
if ! command -v node >/dev/null 2>&1; then
    echo "Node.js was not found on the Jenkins agent PATH."
    echo "This Mac uses nvm. Jenkins must source ~/.nvm/nvm.sh or have Node on PATH."
    exit 127
fi
node -v
npm -v
'''

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
        NVM_DIR = "${env.HOME}/.nvm"
        PATH = "${env.HOME}/.nvm/versions/node/v20.20.2/bin:/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
    }

    stages {
        stage('Install') {
            steps {
                sh "${loadNode}\nnpm ci"
            }
        }

        stage('E2E Tests') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh "${loadNode}\nnpm run test:e2e"
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
