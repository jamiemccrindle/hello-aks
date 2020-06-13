FROM node:14

ARG USERNAME=vscode
ARG USER_UID=10000
ARG USER_GID=$USER_UID

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# Configure apt and install packages
RUN apt-get update \
    && apt-get -y install --no-install-recommends apt-utils dialog 2>&1 \
    #
    # Verify git, process tools, lsb-release (common in install instructions for CLIs) installed
    && apt-get -y install git openssh-client less iproute2 procps apt-transport-https gnupg2 curl lsb-release wget jq unzip tar procps \
    #
    # Create a non-root user to use if preferred - see https://aka.ms/vscode-remote/containers/non-root-user.
    && groupadd --gid $USER_GID $USERNAME \
    && useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME
    #
    # Add sudo support for the non-root user
RUN apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME
    #
    # Install yarn
RUN apt-get remove cmdtest \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install -y yarn
    #
    # Install azure cli
RUN echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ $(lsb_release -cs) main" > /etc/apt/sources.list.d/azure-cli.list \
    && curl -sL https://packages.microsoft.com/keys/microsoft.asc | apt-key add - 2>/dev/null \
    && apt-get update \
    && apt-get install -y azure-cli
    #
    # Clean up
RUN apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=dialog

USER ${USERNAME}

RUN cd /tmp && curl -fsSL https://get.pulumi.com | sh
COPY .bashrc /home/${USERNAME}/

USER root

# Install kubectl
RUN cd /tmp && curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl \
    && mv kubectl /usr/bin/kubectl \
    && chmod +x /usr/bin/kubectl

# Install helm
RUN cd /tmp && wget https://get.helm.sh/helm-v2.16.8-linux-amd64.tar.gz \
    && tar -zxvf helm-v2.16.8-linux-amd64.tar.gz \
    && mv linux-amd64/helm /usr/bin/helm \
    && chmod +x /usr/bin/helm

# Install k9s
RUN cd /tmp && wget -c https://github.com/derailed/k9s/releases/download/v0.20.5/k9s_Linux_x86_64.tar.gz \
    && tar -zxvf k9s_Linux_x86_64.tar.gz \
    && mv k9s /usr/bin/k9s \
    && chmod +x /usr/bin/k9s

COPY init.bash /home/${USERNAME}

RUN chown vscode /home/${USERNAME}/init.bash && chmod u+x /home/${USERNAME}/init.bash

