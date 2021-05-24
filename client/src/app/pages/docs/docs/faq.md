# Frequently Asked Questions

__Q:__ Why KubeIndex?

__A:__ The need to manage many Kubernetes clusters has been around for a long time. KubeIndex is developed for both operational and development teams to get an overview of their structure. It is supposed to be a map for the user to see their cluster structure but also to get a higher overview for a larger organization with Kubernetes clusters hosted on many different vendors with multiple teams.

__Q:__ Can I use Kubernetes Dashboard?

__A:__ Yes, if enabled in the cluster. Every cluster added to KubeIndex will be prompted for existance of the Kubernetes Dashboard. If it exists a link will be provided. KubeIndex helps binding together all the dashboards existing on the clusters.

__Q:__ What Kubernetes operations are supported?

__A:__ Kubernetes Dashboard exists for that, however you can manage namespaces, routes, ingresses, services, secrets and deployments in KubeIndex. From Namespace level and below everything is managed immediately from the KubeIndex client to the Kubernetes API. 

__Q:__ Can I use ArgoCD? 

__A:__ You can use anything deployable in a Kubernetes cluster in KubeIndex. If you are a cluster-reader or a cluster-admin you can get the kube-config from the cluster overview which can be used in Argo. Also the option to create an out of the box ArgoCD-cluster is possible if you choose to provision the cluster through KubeIndex.

__Q:__ Which cloud vendor is available out of the box for managed clusters?

__A:__ At the moment Microsoft Azure is the vendor supported for patching, creating and deleting managed clusters.

