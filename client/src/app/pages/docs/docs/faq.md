# Frequently Asked Questions

__Q: Why KubeIndex?__

__A:__ The need to manage many Kubernetes clusters has been around for a long time. KubeIndex is developed for both operational and development teams to get an overview of their structure. It is supposed to be a map for the user to see their cluster structure but also to get a higher overview for a larger organization with Kubernetes clusters hosted on many different vendors with multiple teams.


__Q: Can I use Kubernetes Dashboard?__

__A:__ Yes, if enabled in the cluster. Every cluster added to KubeIndex will be prompted for existance of the Kubernetes Dashboard. If it exists a link will be provided. KubeIndex helps binding together all the dashboards existing on the clusters.


__Q: What Kubernetes operations are supported?__

__A:__ Kubernetes Dashboard exists for that, however you can manage namespaces, routes, ingresses, services, secrets and deployments in KubeIndex. From Namespace level and below everything is managed immediately from the KubeIndex client to the Kubernetes API. 


__Q: Can I use ArgoCD?__ 

__A:__ You can use anything deployable in a Kubernetes cluster in KubeIndex. If you are a cluster-reader or a cluster-admin you can get the kube-config from the cluster overview which can be used in Argo. Also the option to create an out of the box ArgoCD-cluster is possible if you choose to provision the cluster through KubeIndex.


__Q: Which cloud vendor is available out of the box for managed clusters?__

__A:__ At the moment Microsoft Azure is the vendor supported for patching, creating and deleting managed clusters.

