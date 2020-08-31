FROM centos:7

WORKDIR /home

COPY ./httpd /home

RUN yum update -y \
    && yum install epel-release yum-utils -y \
    && yum install wget git httpd -y \
    && systemctl enable httpd \
    && mkdir /home/Java \
    && cd /home/Java/ \
    && git clone https://github.com/protos-kr/IF-105.UI.dtapi.if.ua.io.git \
    && cd IF-105.UI.dtapi.if.ua.io/ \
    && sed -i -e "s|https://dtapi.if.ua/api/|http://35.198.143.128/dt-api/|g" /home/Java/IF-105.UI.dtapi.if.ua.io/src/environments/environment.ts \
    && sed -i -e "s|https://dtapi.if.ua/api/|http://35.198.143.128/dt-api/|g" /home/Java/IF-105.UI.dtapi.if.ua.io/src/environments/environment.prod.ts \
	&& curl -sL https://rpm.nodesource.com/setup_12.x | bash - \
	&& yum clean all && yum makecache fast \
	&& yum install -y gcc-c++ make \
	&& yum install -y nodejs \
	&& npm install -g @angular/cli@8.3.21 \
	&& npm install -y \
    && rm -rf package-lock.json \
    && ng build --prod \
    && mkdir /var/www/dtester/ \
    && cp -r /home/Java/IF-105.UI.dtapi.if.ua.io/dist/IF105/* /var/www/dtester \
    && cp /home/Java/IF-105.UI.dtapi.if.ua.io/.htaccess /var/www/dtester/ \
    && mkdir /etc/httpd/sites-available /etc/httpd/sites-enabled /var/log/httpd/dtester \
    && cp /home/dtester.conf /etc/httpd/sites-available/ \
    && echo "IncludeOptional sites-enabled/*.conf" >> /etc/httpd/conf/httpd.conf \
    && ln -s /etc/httpd/sites-available/dtester.conf /etc/httpd/sites-enabled/dtester.conf \
	&& chown -R apache:apache -R /var/www/dtester/ \
	&& chmod 766 -R /var/www/dtester/ \
    && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/usr/sbin/httpd", "-D", "FOREGROUND"]
