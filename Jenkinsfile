pipeline {
	agent any

	stages {
		stage ("Build"){
			steps {
				sh 'docker build -t transactions:0.1.${BUILD_NUMBER} .'
				sh 'docker create --name=transactions_0.1.${BUILD_NUMBER} transactions:0.1.${BUILD_NUMBER}'

				sh 'docker cp $(docker ps -a -q --filter "name=^/transactions_0.1.${BUILD_NUMBER}$"):/tmp/unittest.xml .'
			}
		}

		stage ("Test"){
			steps {
				junit '/home/jenkins/workspace/transactions/unittest.xml'
			}
		}

		stage ("Deploy"){
			steps {
				echo "Build"
			}
		}
	}
}