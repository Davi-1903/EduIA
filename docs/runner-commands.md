Docker Model Runner (DMR) is natively supported on Linux as a CLI plugin for Docker Engine (Docker CE). It allows you to pull, run, and manage AI large language models (LLMs) locally as OCI artifacts without dealing with complex Python dependencies. [1, 2, 3, 4] 

## 1. Installation

Install the docker-model-plugin package using your Linux distribution's package manager: [5, 6] 

**Ubuntu / Debian / Mint**

```
sudo apt-get update
sudo apt-get install docker-model-plugin
```

**Fedora / RHEL / CentOS**

```
sudo dnf update
sudo dnf install docker-model-plugin
```

**Arch Linux**

Available via community-supported repository scripts like the [AUR package](https://medium.com/@gbadahamza18/bringing-docker-model-runner-to-arch-linux-a-one-command-install-via-aur-90ed70290eed)

## 2. Service Management (Linux Specific)

Unlike macOS or Windows where Docker Desktop manages the runtime background lifecycle automatically, Linux users must initialize and start the host runner component via the Docker CLI:

```
# Initialize and install the runner engine
docker model install-runner
# Start the runner service 
docker model start-runner
# Verify the plugin installation status
docker model version
docker model status
```

## 3. Core Commands

Once the runner is active, you can interact with models using familiar container-like commands: [12, 13] 

* **Download a model:** docker model pull ai/smollm2
* **List downloaded models:** docker model ls
* **Run a model interactively:** docker model run ai/smollm2
* **See running models:** docker model ps

## 4. GPU Acceleration (NVIDIA)

To leverage an NVIDIA graphics card for hardware-accelerated inference on Linux, use the --gpu flag with the cuda backend during execution:

```
# Ensure your NVIDIA Docker runtime is functional
nvidia-smi
# Run with hardware acceleration
docker model run --gpu cuda ai/llama3.2
```

## 5. OpenAI Compatible API

When a model runs, DMR automatically spins up a local server exposing an OpenAI-compliant REST API. You can connect external applications, codebases, or local web interfaces directly to your local endpoint (typically active on port 12434)
Would you like to know how to integrate Docker Model Runner with Docker Compose for an application stack, or do you need help troubleshooting NVIDIA CUDA driver visibility?

[1] [https://github.com](https://github.com/docker/model-runner)
[2] [https://localaimaster.com](https://localaimaster.com/blog/docker-model-runner-guide)
[3] [https://www.docker.com](https://www.docker.com/blog/announcing-docker-model-runner-ga/)
[4] [https://medium.com](https://medium.com/@bhaskaro/docker-model-runner-demystified-a-practical-guide-to-running-local-llms-like-containers-895af3ddcb0c)
[5] [https://docs.docker.com](https://docs.docker.com/ai/model-runner/get-started/)
[6] [https://transp.pppl.gov](https://transp.pppl.gov/docker.html)
[7] [https://www.virtono.com](https://www.virtono.com/community/knowledgebase/docker-installation/)
[8] [https://oneuptime.com](https://oneuptime.com/blog/post/2026-03-18-choose-between-podman-and-docker/view)
[9] [https://medium.com](https://medium.com/@gbadahamza18/bringing-docker-model-runner-to-arch-linux-a-one-command-install-via-aur-90ed70290eed)
[10] [https://docs.docker.com](https://docs.docker.com/ai/model-runner/)
[11] [https://www.pcmag.com](https://www.pcmag.com/news/how-to-use-docker-advice-for-and-by-a-sysadmin)
[12] [https://www.youtube.com](https://www.youtube.com/watch?v=KL4WU_04CrA)
[13] [https://ai.plainenglish.io](https://ai.plainenglish.io/docker-model-runner-vs-ollama-choosing-the-right-tool-for-local-llm-deployment-8984f9eebb2d)
[14] [https://www.ajeetraina.com](https://www.ajeetraina.com/docker-model-runner-tutorial-and-cheatsheet-mac-windows-and-linux-support/)
[15] [https://docs.codegpt.co](https://docs.codegpt.co/docs/tutorial-ai-providers/docker)
[16] [https://www.javacodegeeks.com](https://www.javacodegeeks.com/docker-powered-spring-ai.html)
[17] [https://wiki.archlinux.org](https://wiki.archlinux.org/title/Docker)
[18] [https://dzone.com](https://dzone.com/articles/docker-model-runner-dotnet-guide)
[19] [https://medium.com](https://medium.com/@jarun4729/run-llama-3-2-locally-a-privacy-first-guide-to-docker-model-runner-87978cc3a5b0)

# Principais comandos

- **Baixar um model:** `docker model pull ai/smollm2`
- **Listar modelos baixados:** `docker model ls`
- **Executar modelo no modo interativo:** `docker model run ai/smollm2`
- **Ver modelos rodando:** `docker model ps`
