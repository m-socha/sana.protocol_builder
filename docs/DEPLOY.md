
Configuration with Chef
=======================

We use Chef to configure our servers and automate our deployments.

##Dependencies

On your local machine, you will need the following packages to configure a server with Chef:

- Git
- Ruby (>= 1.9.3)
- Bundler
- Python
- Fabric

This will vary depending on your OS, but here's an example using Ubuntu:

```shell
apt-get update
apt-get install git python-pip
gem install bundler
pip install fabric
```

Then clone this repository somewhere:
```
git clone https://github.com/SanaMobile/sana.protocol_builder.git ~/sana
```

Now, enter the `chef` subdirectory and run `bundle install`:

```shell
cd chef
bundle install
cd ..
```

This will install Chef as well as Librarian, a cookbook manager (Chef's equivalent of bundler).

##Configuring the server

Before proceeding, make sure your machine's public SSH key is in the server's `authorized_keys` file. It should also be authorized for this repository on GitHub.

In order to decrypt the secrets stored in `data_bags/secrets/sana_protocol_builder.json`, you will need to place the data bag key in `chef/.chef/data_bag_key`. If you are unable to acquire this key from one of the project maintainers, you can generate new secrets and encrypt the data bag with your own key.

Now, we can install Chef on the server and fully configure it. The `knife solo` command will follow the steps defined in `chef/nodes/sanaprotocolbuilder.me.json`, resolving the cookbook dependencies and uploading them to the server for us.

```shell
knife solo bootstrap root@sanaprotocolbuilder.me --bootstrap-version 11.16.4
```

Deploying
=========

Now that the server is fully configured, we are ready to deploy our application.

```shell
fab local_deploy
```