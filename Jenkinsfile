pipeline {
	agent any

	stages {
		stage ("Build"){
			steps {
				sh 'docker build -t transactions:0.1.${BUILD_NUMBER} .'
				sh 'docker create --name=transactions_0.1.${BUILD_NUMBER} transactions:0.1.${BUILD_NUMBER}'

				sh 'docker cp $(docker ps -a -q --filter "name=^/transactions_0.1.${BUILD_NUMBER}$"):/tmp/ .'
				sh 'mkdir -p /usr/src/app/'
				sh 'docker cp $(docker ps -a -q --filter "name=^/transactions_0.1.${BUILD_NUMBER}$"):/usr/src/app/ ./usr/src/app/'
			}
		}

		stage ("Linter"){
			steps {
				sh "sed -i -e 's/usr\/src\/app/${WORKSPACE}\/${JOB_NAME}/g' /tmp/eslint.xml"
				step([$class: 'WarningsPublisher',
					parserConfigurations: [[
						parserName: 'JSLint',
						pattern: 'tmp/eslint.xml'
					]],
					unstableTotalAll: '0',
					usePreviousBuildAsReference: true
				])
			}
		}

		stage ("Test"){
			steps {
				sh 'touch tmp/unittest.xml'
				junit 'tmp/unittest.xml'
			}
		}

		stage ("Code coverage"){
			steps {
				step([$class: 'CoberturaPublisher', autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: '**/cobertura-coverage.xml', failUnhealthy: false, failUnstable: false, maxNumberOfBuilds: 0, onlyStable: false, sourceEncoding: 'ASCII', zoomCoverageChart: false])
			}
		}

		stage ("Deploy"){
			steps {
				echo "Build"
			}
		}
	}
}