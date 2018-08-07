# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='element',
            unique_together=set([]),
        ),
        migrations.AlterUniqueTogether(
            name='page',
            unique_together=set([]),
        ),
    ]
