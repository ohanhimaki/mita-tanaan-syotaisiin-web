#!/bin/bash
set -e

echo "Installing .NET 10 SDK..."

# Download and install .NET 10 SDK
wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 10.0 --install-dir $HOME/.dotnet

# Add to PATH - prepend so .NET 10 takes priority over system dotnet
export DOTNET_ROOT=$HOME/.dotnet
export PATH=$DOTNET_ROOT:$DOTNET_ROOT/tools:$PATH

# Install required workloads
dotnet workload install wasm-tools

# Verify installation
dotnet --version

echo "Building application..."
dotnet publish -c Release -o release src/MTS.Web/MTS.Web.csproj
