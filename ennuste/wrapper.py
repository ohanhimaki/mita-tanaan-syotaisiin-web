import argparse
import download_from_fauna
import preprocess_data
import make_predictions
import os

# Create an argument parser
parser = argparse.ArgumentParser(description='Wrapper script for running different parts of the program.')

# Add options for running different parts of the program
parser.add_argument('-d', '--download', action='store_true', help='Download data from FaunaDB')
parser.add_argument('-c', '--clean', action='store_true', help='Clean downloaded data')
parser.add_argument('-p', '--preprocess', action='store_true', help='Preprocess cleaned data')
parser.add_argument('-m', '--makepredictions', action='store_true', help='Make predictions and save back to FaunaDB')

# Parse the arguments
args = parser.parse_args()

# Call the appropriate functions based on the selected options
if args.download:
  download_from_fauna.download_from_fauna()
if args.preprocess:
  preprocess_data.preprocess_data()
if args.makepredictions:
  make_predictions.make_predictions()
