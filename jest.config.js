module.exports = {
    "roots": [
        "./test"
    ],
    "preset": "ts-jest",
    "testEnvironment": "node",
    "testMatch": [
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    }
}